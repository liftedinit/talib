# Design: zero-fill the burned-MFX series

**Date:** 2026-05-26
**Status:** Approved (brainstormed with maintainer)
**Scope:** Server only — `MigrationsService.getBurnedMfxSeries`. The endpoint response
shape, the controller, and both client charts are unchanged.

## Problem

`getBurnedMfxSeries` returns a cumulative day-bucketed series, but it only emits a row
for days that *had* a migration. On the live data (neighborhood 1) that is **32 active
days spread across 348 calendar days**, with gaps between active days averaging **11.2
days** (max **172 days**).

The cumulative chart is unaffected in value (its last point is the true total), but the
**rate chart is materially wrong**. `calculateRates` (client) assumes points are
adjacent in time, so on a sparse series each "per day" window's diff actually spans the
whole gap but is labelled as one day. Result: the per-day average reads **111,916
MFX/day** when the true average daily burn is **~9,970 MFX/day** (total ÷ 348 days) — an
~11.2× overstatement (exactly the mean gap). Per-week and per-month are distorted the
same way.

## Goal

Emit a **dense daily series**: one point for every calendar day from the first migration
day through **today (UTC)**, with the cumulative value carried forward (0 increment on
days with no migrations). With daily-adjacent points, the client's windowed rate
calculation becomes correct with **no client changes**.

## Design

Replace the SQL in `getBurnedMfxSeries`. Keep the per-day aggregation (the `daily` CTE),
add a daily date spine and left-join onto it:

```sql
WITH daily AS (                       -- per-day burn totals (aggregation unchanged)
  SELECT date_trunc('day', m."manifestDatetime") AS day,
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
),
spine AS (                            -- every UTC day, first burn day -> today
  SELECT generate_series(
           (SELECT min(day) FROM daily),
           date_trunc('day', (now() AT TIME ZONE 'UTC')),
           interval '1 day'
         ) AS day
)
SELECT
  spine.day AS timestamp,
  SUM(COALESCE(daily.amount, 0)) OVER (ORDER BY spine.day) AS cumulative
FROM spine
LEFT JOIN daily ON daily.day = spine.day
ORDER BY spine.day ASC;
```

### Decisions

- **Start:** first migration day (`min(day)` from `daily`). No backfill to genesis.
- **End:** today in **UTC**, via `now() AT TIME ZONE 'UTC'` — correct regardless of the
  DB session timezone, and consistent with the UTC-naive `manifestDatetime` (a
  `timestamp without time zone` holding UTC wall-clock).
- **Empty case preserved:** no migrations → `daily` empty → `min(day)` is `NULL` →
  `generate_series(NULL, …)` yields 0 rows → `{ timestamps: [], data: [] }`. Same as
  today, and the early-return when the MFX token row is missing is unchanged.
- **Output type:** `timestamp` (midnight) values, matching the existing
  `date_trunc('day', …)` output, so the service's row→`{timestamps, data}` transform and
  the client's `new Date(t)` parsing are unaffected.

## Performance — REQUIRED: no N+1, no per-row queries

This must remain **one SQL round trip**. Hard requirements:

- **Single query.** Do NOT fetch the sparse series and then loop issuing per-day queries,
  and do NOT fill in application code with per-row DB access. The spine, the fill, and the
  cumulative must all happen in the one query above.
- **Aggregate before joining.** `daily` aggregates first (~N active days, tiny); the
  spine is ~one row per calendar day in range; the `LEFT JOIN` is 1:1 on `day`. No cross
  joins or fan-out.
- **Bounds computed once.** `min(day)` and the today expression are scalar subqueries
  evaluated a single time, not per row.
- **Scale check.** Mainnet (neighborhood 6) may span a few years → ~1,000–2,000 daily
  points. That is still one query returning a bounded result set; confirm it stays a
  single indexed scan + window aggregate (check `EXPLAIN` shows no nested-loop blowup).
  The window `SUM(...) OVER (ORDER BY day)` is O(n log n) on the spine — fine.
- The migration→details→transaction→block joins are the same ones the current query
  already uses; we add no new per-row lookups.

## Effect on charts (no client code change)

- **Cumulative chart:** smooth daily line, flat through quiet stretches, extending to
  today. Final value unchanged (still the true total).
- **Rate chart:** windows are now daily-adjacent, so per-day ≈ true daily burn, and the
  trailing zero-burn days near today correctly pull recent rates toward 0. The headline
  average becomes truthful.

## Testing

- **Unit (server, `migrations.service.spec.ts`):** the existing tests mock
  `manager.query`, so the row→`{timestamps,data}` transform tests stay valid. Update the
  "emits SQL" test to assert the new query shape (`generate_series`, `AT TIME ZONE 'UTC'`,
  `LEFT JOIN`, `COALESCE(daily.amount, 0)`). Keep the empty-token and warn-once tests.
- **Live-DB verification (against `burned-mfx-db-1`, neighborhood 1):** the SQL fill is
  not exercised by the mocked unit tests, so verify the real query directly. Acceptance:
  - Point count = days from `2025-06-10` through today UTC inclusive (≈ 351), **not** 32.
  - Cumulative is monotonic non-decreasing and **flat** across known gaps.
  - Final cumulative **unchanged**: `3469397230140100` uMFX (= **3,469,397.23014 MFX**).
  - Recomputing the client rate over the dense series: per-day average ≈ **9,970 MFX/day**
    (down from 111,916), with the long zero stretches reflected.
- **Client suite + server suite both green**, `tsc` clean. (Fresh worktree needs
  `npm install` at root, `client/`, and `server/` before running tests.)
- **Optional end-to-end:** rebuild the docker image from this worktree and recreate
  `talib-app-1` (network `burned-mfx_default`, `-p 3000:3000`, mount
  `/home/fmorency/dev/talib/.env.dev:/app/server/.env`); confirm the rate card now shows
  ~9,970 MFX/day. DB (`burned-mfx-db-1`) must not be touched.

## Files

- `server/src/neighborhoods/migrations/migrations.service.ts` — replace the SQL in
  `getBurnedMfxSeries`.
- `server/src/neighborhoods/migrations/migrations.service.spec.ts` — update the SQL-shape
  assertion; add coverage for the dense/empty behavior at whatever level is practical.
