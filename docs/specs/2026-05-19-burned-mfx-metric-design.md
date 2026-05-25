# Burned MFX Metric — Design

**Status:** Draft for review
**Date:** 2026-05-19

## Goal

Add two charts to the Tokenomics section of the Metrics tab in talib:

1. **Cumulative Burned MFX** — running total of MFX burned via migrations to the `maiyg` address, over the entire migration history.
2. **MFX Burn Rate** — burn rate per configurable time unit (per day / per week / per month), derived from the cumulative series. Finer-than-daily units are excluded because the server returns a day-bucketed series.

"Burned MFX" is defined as: completed migration transactions (ledger send to `maiyg` with a UUID memo) of the MFX token, counted by `manifestDatetime` (the timestamp at which the migration successfully executed on the Manifest chain).

Migration detection logic already exists (`MigrationAnalyzerService`); this work only adds query and presentation layers on top of the existing `migration` table.

## Non-goals

- Burn metrics for tokens other than MFX (filter is MFX-only; the underlying data model can support other symbols later).
- Per-neighborhood selection in the UI. A single configured neighborhood (the mainnet) is used.
- Server-side rate calculation or alternate timespan dropdowns. Timespan is implicit (entire history); rate unit is computed client-side.

## High-level architecture

```
┌──────────────────────────────────────────────────────────────┐
│  Tokenomics tab (client/src/pages/metrics/networkMetrics.tsx) │
│  ┌────────────────────────────┐  ┌────────────────────────┐  │
│  │ <BurnedMfxCumulativeChart/>│  │ <BurnedMfxRateChart/>  │  │
│  │   Apex area chart          │  │   Apex area + dropdown │  │
│  └────────────┬───────────────┘  └────────────┬───────────┘  │
│               └────────── React Query (shared key) ──────────│
└───────────────────────────────┬──────────────────────────────┘
                                │ GET
                                ▼
   /neighborhoods/:nid/migrations/burned-mfx/series
                                │
                                ▼
┌──────────────────────────────────────────────────────────────┐
│  MigrationsController                                         │
│    └─ MigrationsService.getBurnedMfxSeries(nid)               │
│        ├─ 1× lookup: MFX address from Token (neighborhood,    │
│        │   symbol='MFX'); table is tiny, no JOIN per row      │
│        └─ 1× series query: window-function cumulative SUM,    │
│            grouped by DATE_TRUNC('day', manifest_datetime),   │
│            filtered by manifestDatetime IS NOT NULL + symbol  │
└──────────────────────────────────────────────────────────────┘
```

**Key choices:**

- One source-of-truth endpoint returns the day-bucketed cumulative series. The rate chart derives from it client-side. One HTTP call per page load serves both charts (shared React Query key).
- Endpoint lives in `MigrationsModule` (resource-oriented), not in `MetricsModule` — the existing `/metrics/:name/series` route is Prometheus-coupled and would have to be hacked to accommodate non-Prometheus data.
- Mainnet neighborhood id is read from a client-side Vite env var (no runtime neighborhood selection).

## Server

### Endpoint

```
GET /neighborhoods/:nid/migrations/burned-mfx/series
```

No query params. `:nid` validated by `ParseIntPipe`. Response:

```ts
{ timestamps: Date[]; data: string[] }  // strings preserve uMFX integer precision
```

Day-bucketed (`DATE_TRUNC('day', ...)`) and ordered ASC. `data[i]` is the cumulative burned uMFX up to and including `timestamps[i]`.

### Service method

`MigrationsService.getBurnedMfxSeries(neighborhoodId: number): Promise<SeriesEntity>`

Two SQL statements per request — both bounded, neither N+1. First, resolve the MFX token's string-form address (one row, filtered by `(neighborhood_id, symbol='MFX')` — not the `Token` unique index, but the table is tiny so cost is negligible; see the `$2` note below). Then run the series query, passing that address as a parameter:

```sql
WITH daily AS (
  SELECT
    date_trunc('day', m."manifestDatetime") AS day,
    SUM((COALESCE(
      td.argument ->> 'amount',
      td.argument -> 'transaction' -> 'argument' ->> 'amount'
    ))::numeric) AS amount
  FROM migration m
  INNER JOIN transaction_details td ON td.id = m."detailsId"
  INNER JOIN transaction t          ON t.id  = m."transactionId"
  INNER JOIN block b                ON b.id  = t."blockId"
                                     AND b."neighborhoodId" = $1
  WHERE m."manifestDatetime" IS NOT NULL
    AND COALESCE(
      td.argument ->> 'symbol',
      td.argument -> 'transaction' -> 'argument' ->> 'symbol'
    ) = $2
  GROUP BY date_trunc('day', m."manifestDatetime")
)
SELECT
  day AS timestamp,
  SUM(amount) OVER (ORDER BY day) AS cumulative
FROM daily
ORDER BY day ASC;
```

`MigrationAnalyzerService` writes two `transaction_details.argument` shapes for completed migrations: a direct `ledger.send` (where `amount`/`symbol` are at the top level), and a multisig submit (where the real send is nested under `transaction.argument`). The `COALESCE` over both paths covers both shapes — without it, multisig migrations are silently dropped from the metric.

`$2` is the MFX token's string-form address, resolved once at the start of the call by a separate cheap lookup against the `Token` table (unique key `(neighborhood, address)`; we filter by `(neighborhood_id, symbol='MFX')`, which is not index-backed but the table is tiny so the cost is negligible). Resolution is **one extra SQL statement per request, not per row** — the address is then passed as a literal parameter into the main query.

**Why this is N+1-free:**

- One query to resolve the MFX address, one query for the series. No per-row follow-ups.
- All joins are on indexed columns (`block.neighborhoodId`, `transaction.blockId`, `migration.transactionId`, `migration.detailsId`).
- `SUM(...) OVER (ORDER BY day)` is a single window pass over the already-aggregated CTE.

### Optional performance index

If `EXPLAIN ANALYZE` shows a seq scan dominating, add a partial index:

```sql
CREATE INDEX IF NOT EXISTS idx_migration_manifest_datetime_not_null
  ON migration ("manifestDatetime")
  WHERE "manifestDatetime" IS NOT NULL;
```

Gated on profiling — not shipped by default.

### Module wiring

`MigrationsModule.imports`: extend `TypeOrmModule.forFeature([...])` with `Token`. No new providers; the existing `MigrationsService` gains one method.

### Error handling (server)

| Case | Behavior |
|---|---|
| `:nid` non-numeric | 400 via `ParseIntPipe`. |
| Neighborhood not found / has no migrations | Return empty `{ timestamps: [], data: [] }`. |
| MFX token row missing for that neighborhood | Return empty series. Log a `warn` exactly once per process (in-memory boolean gate), not per request. |
| SQL error | `logger.error` with `{ nid, error }` context, re-throw → 500 (matches other `MigrationsService` methods). |

## Client

### New files

- `client/src/ui/burned-mfx-cumulative-chart.tsx` — Apex area chart (~80 LOC). Converts uMFX → MFX (`/ 1e9` — MFX has 9 decimal places) for display, formats large numbers (K / M / B). Hardcoded label `"Burned MFX"`, y-axis title `"MFX"`.
- `client/src/ui/burned-mfx-rate-chart.tsx` — Apex area chart + `<Select>` for rate unit. Uses the same React Query result as the cumulative chart (same query key) → no double-fetch.
- `client/src/utils/burn-rate.ts` — pure function `calculateRates(series, rateUnit)`, ported from `manifest-dashboard/src/lib/utils/rateCalculation.ts` (two-pointer O(n) over the sorted cumulative series; uses native `BigInt`).

### API helper

`client/src/api/queries.ts`:

```ts
export function getBurnedMfxSeries(nid: number) {
  return get(`neighborhoods/${nid}/migrations/burned-mfx/series`);
}
```

### React Query key

`["neighborhoods", nid, "migrations", "burned-mfx", "series"]` — shared between both chart components to guarantee a single HTTP call.

### Page wiring

In `client/src/pages/metrics/networkMetrics.tsx`, inside the existing `Tokenomics` `SimpleGrid` (right after the `Total Tokens` cell):

```tsx
<Box backgroundColor="transparent">
  <BurnedMfxCumulativeChart nid={MFX_NEIGHBORHOOD_ID} />
</Box>
<Box backgroundColor="transparent">
  <BurnedMfxRateChart nid={MFX_NEIGHBORHOOD_ID} />
</Box>
```

### Rate-chart dropdown

Options: `Per Day` (default), `Per Week`, `Per Month`. `Per Hour` is intentionally omitted because the server returns a day-bucketed series, so an hourly window would degenerate to the same value as `Per Day`. Selected unit kept in component-local `useState` — no URL sync (talib doesn't otherwise route metric state through URLs).

### Configuration

- New Vite env var `VITE_MFX_NEIGHBORHOOD_ID` (string parsed to number). Added to `client/.env` (which currently holds `VITE_API_PATH`) and documented in `client/README.md` under a new "Environment variables" section.
- Read once in `networkMetrics.tsx`: `const MFX_NEIGHBORHOOD_ID = Number(import.meta.env.VITE_MFX_NEIGHBORHOOD_ID);`.
- If missing, empty, or non-positive, both chart cells render an inline centered teal-text fallback ("Burned MFX chart not configured") shaped like the chart's own empty/error states — same `<Box p={4} h={["200px","300px","400px"]}>` shell, `<Center>`, `<Text color="brand.teal">` — so no layout jump between configured and misconfigured rendering.
- No new runtime deps: `calculateRates` uses native `BigInt` (subtract, sign-check, stringify is all we need over integer uMFX strings).
- New module exports added in `client/src/ui/index.ts` for both chart components.

### Error handling (client)

| Case | Behavior |
|---|---|
| `VITE_MFX_NEIGHBORHOOD_ID` missing, empty, or non-positive | Both cells render a centered teal-text "Burned MFX chart not configured" placeholder, same shape as the chart's own empty state. |
| Network or HTTP error | React Query `isError` branch → centered `"Error loading chart data"` (same pattern as `metric-chart.tsx`). |
| Empty series (length 0) | Cumulative: centered `"No migrations yet"`. Rate: same (`calculateRates` returns `[]` for length < 2). |
| Single data point | Cumulative renders fine. Rate: centered `"Insufficient data"` (mirrors `manifest-dashboard`'s `<RateChartCard>` fallback). |
| Non-monotonic cumulative (defensive) | `calculateRates` clamps negative diffs to 0 — same as the dashboard reference. |

## Testing

### Server

- **Unit — `MigrationsService.getBurnedMfxSeries`:** seed test Postgres with two neighborhoods, MFX token in both, plus migration rows covering: completed MFX in nid 1, pending MFX in nid 1 (no `manifestDatetime`), wrong symbol in nid 1, completed MFX in nid 2. Assert:
  - Only completed MFX migrations for the requested nid contribute.
  - Output is day-bucketed, ASC, cumulative (monotonic non-decreasing).
  - Empty result when the neighborhood has no MFX migrations.
  - Empty result when the token row is missing, with `warn` logged exactly once across multiple calls.
- **Controller smoke test (`supertest`):** `GET /neighborhoods/:nid/migrations/burned-mfx/series` — 200 + correct shape; non-numeric `:nid` → 400.
- **No-N+1 verification:** wrap the test with a TypeORM `afterQuery` listener counting SQL statements; assert ≤ 2 per request (MFX address resolution + series).

### Client

- **Unit — `calculateRates`:** empty input → `[]`; one point → `[]`; monotonic input → correct per-day / per-week diffs; window larger than span → entries skipped; non-monotonic → negative clamped to 0.
- **Component — `<BurnedMfxRateChart>`:** mock React Query with a fixed cumulative series; switching the dropdown changes the rendered series length and re-runs `calculateRates`.
- **Component — `<BurnedMfxCumulativeChart>`:** mock query → snapshot the Apex `series` + `options` values (not full Apex render).
- **Env-guard test:** unset `VITE_MFX_NEIGHBORHOOD_ID` → both cells render the centered teal-text "Burned MFX chart not configured" placeholder.

### Manual verification

Start dev stack (`docker-compose up`), hit the metrics page, confirm both charts populate against seeded data, exercise the rate-unit dropdown, watch the network tab to confirm a single HTTP call serves both charts.

## Open items

None. All decisions are captured in the sections above:

- Two charts: cumulative + rate (configurable per_day / per_week / per_month; per_hour omitted because the series is day-bucketed).
- Hard-coded neighborhood (mainnet) via Vite env var.
- MFX-only via a `Token` table lookup on `(neighborhood_id, symbol='MFX')`; address passed as a parameter to the series query.
- Completed migrations only, timestamped by `manifestDatetime`.
- Fixed timespan (all-time) with rate-unit dropdown only.
