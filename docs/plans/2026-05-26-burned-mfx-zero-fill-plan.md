# Zero-fill the burned-MFX series — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `MigrationsService.getBurnedMfxSeries` emit a **dense daily** cumulative series — one point per UTC calendar day from the first migration day through today — instead of one point only on days that had a migration. The cumulative value is carried forward (0 increment on quiet days) so the client's windowed rate calculation (`calculateRates`) becomes correct with **no client change**.

**Scope:** Server only. One method (`getBurnedMfxSeries`) and its unit test. The endpoint response shape (`{ timestamps, data }`), the controller, `SeriesEntity`, and both client charts are unchanged.

**Spec:** `docs/specs/2026-05-26-burned-mfx-zero-fill-design.md` (Approved).

**Why:** On neighborhood 1 the sparse series is 32 active days across 348 calendar days (mean gap 11.2 days). `calculateRates` assumes points are time-adjacent, so the headline per-day rate reads **111,916 MFX/day** vs. a true **~9,970 MFX/day**. A dense daily spine fixes the rate math at the source.

---

## File Map

**Server (modified):**
- `server/src/neighborhoods/migrations/migrations.service.ts` — replace **only** the SQL string inside `getBurnedMfxSeries` (lines ~81–106). The Token lookup, the missing-token early return + warn-once, the bytea→UTF-8 address decode, the `params` array, and the row→`{timestamps,data}` transform all stay exactly as-is.
- `server/src/neighborhoods/migrations/migrations.service.spec.ts` — update the "emits SQL" / shape assertions to the new query; keep the transform, empty-token, and warn-once tests.

**Nothing else changes.** No new files, no controller/module/DTO/client edits.

---

## Key facts established during planning (do not re-derive)

- `migration."manifestDatetime"` is a `timestamp without time zone` holding **UTC wall-clock** (`migration.entity.ts:54`, nullable). The current query already uses `date_trunc('day', m."manifestDatetime")`, producing midnight `timestamp without time zone` values.
- `SeriesEntity` is `{ data: number[] | string[]; timestamps: Date[] }` (`metrics.service.ts:15`). `cumulative` is `numeric` → returned as a **string** by the pg driver; the transform maps it straight through, so keep it a string.
- The transform reads `r.timestamp` and `r.cumulative` by name (`migrations.service.ts:111–112`). The new query MUST keep those two output column aliases.
- The new query's `timestamp` output stays `timestamp without time zone` (see "Output type" below), so pg-driver Date parsing is **identical to today** — no timezone-parsing regression risk.
- Client `calculateRates` (`client/src/utils/burn-rate.ts`) is a two-pointer diff over the ASC series; with daily-adjacent points the `per_day` baseline becomes the immediately preceding day, so each rate point equals that day's burn. `calculateAverageRate` is the mean of those points. This is exactly why the dense spine fixes the headline number.

---

## Task 1: Replace the SQL in `getBurnedMfxSeries`

**File:** `server/src/neighborhoods/migrations/migrations.service.ts`

- [ ] **Step 1: Swap the query body.** Replace the template-literal SQL passed to `this.migrationRepository.manager.query(...)` with the dense-spine query below. Leave the `[neighborhoodId, mfxAddressStr]` params and everything around the call untouched.

```sql
WITH daily AS (                       -- per-day burn totals (aggregation UNCHANGED from current query)
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
),
spine AS (                            -- every UTC day, first burn day -> today (UTC)
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
ORDER BY spine.day ASC
```

  Critical details the implementer MUST preserve:
  - **Output aliases stay `timestamp` and `cumulative`** — the transform depends on them.
  - **`COALESCE(daily.amount, 0)`** inside the window `SUM` is what carries the cumulative forward across zero-burn days. Do not drop the `COALESCE`.
  - **`ORDER BY spine.day`** in the window frame — order by the *spine* column, not `daily.day` (which is NULL on filled days).
  - **`$1` / `$2`** keep their current meaning (`neighborhoodId`, `mfxAddressStr`); param array is unchanged.
  - Keep the two-shape `COALESCE(... ->> 'symbol' ...)` / `COALESCE(... ->> 'amount' ...)` JSON extraction verbatim — it covers both the direct `ledger.send` and the multisig-wrapped argument shapes.

- [ ] **Step 2: Confirm the empty case is preserved (read-through, no code).** No migrations → `daily` is empty → `(SELECT min(day) FROM daily)` is `NULL` → `generate_series(NULL, <today>, interval '1 day')` yields **0 rows** → `rows = []` → transform returns `{ timestamps: [], data: [] }`. This matches today's behavior. The missing-MFX-token early return (lines 64–72) is upstream of the query and is untouched.

- [ ] **Step 3: Confirm the row→object transform is unchanged.** `rows.map(r => r.timestamp)` and `rows.map(r => r.cumulative)` still apply 1:1. `cumulative` stays a string (numeric column). No change to lines 110–113.

### Output type — why timestamp parsing does not regress
`min(day)` is a `timestamp without time zone` (it is `date_trunc('day', manifestDatetime)`); `date_trunc('day', now() AT TIME ZONE 'UTC')` is also `timestamp without time zone`. `generate_series(timestamp, timestamp, interval)` therefore returns `timestamp without time zone`, the **same type the current query emits** for `day`. So the pg driver maps the new `timestamp` column to JS `Date` exactly as before — no client-side `new Date(t)` behavior change.

---

## Performance — HARD requirements (must hold, not "nice to have")

These are acceptance criteria, not guidelines. The implementation must satisfy all of them:

1. **One SQL round trip.** Exactly one `manager.query(...)` call after the Token lookup. The spine generation, the zero-fill, and the cumulative are ALL inside this single statement. Explicitly forbidden: fetching the sparse series then looping per-day queries; filling gaps in JS with per-row DB access; any `for`/`map` that issues a query.
2. **Aggregate before joining.** `daily` aggregates first (~N active days; 32 on nbhd 1) → tiny. The `spine` is one row per calendar day in range. The `LEFT JOIN daily ON daily.day = spine.day` is **1:1** (both sides are distinct midnight days) — no fan-out, no cross join.
3. **Bounds computed once.** `(SELECT min(day) FROM daily)` and `date_trunc('day', now() AT TIME ZONE 'UTC')` are scalar subqueries evaluated a single time, not per row. `now()` is `STABLE` (one value per statement).
4. **Window cost is fine.** `SUM(...) OVER (ORDER BY spine.day)` is O(n log n) over the spine (one sort + a single running aggregate). The spine is bounded by the calendar range.
5. **Scale sanity.** Mainnet (neighborhood 6) may span a few years → ~1,000–2,000 daily spine points. Still one bounded query returning ~1–2k small rows. No per-row DB work, so cost grows linearly with calendar span, not with migration count squared.
6. **CTE evaluated once.** `daily` is referenced twice (inside `spine`'s `min(day)` subquery and in the main `LEFT JOIN`). Postgres materializes a multiply-referenced CTE once, so the migration→details→transaction→block join runs a single time. No new per-row lookups beyond the joins the current query already performs.

### EXPLAIN check (Task 3 owns running it)
On the live DB, `EXPLAIN ANALYZE` of the new query must show:
- A **single** scan of the migration/details/transaction/block joins feeding the `daily` aggregate (no repeated nested-loop re-scan of that join per spine row).
- A `Function Scan` on `generate_series` for the spine.
- A `WindowAgg` (and a `Sort`/`Hash`/`Merge` left join) over a bounded row count.
- **No** nested-loop blow-up where row counts multiply (e.g. spine-rows × migration-rows). If a nested loop appears, it must be against the small materialized `daily`, not the raw join.

---

## Task 2: Update the unit test

**File:** `server/src/neighborhoods/migrations/migrations.service.spec.ts`

The tests mock `manager.query`, so they exercise the transform and the **emitted SQL string**, not the real fill. Update the SQL-shape assertions to the new query; keep the behavioral tests.

- [ ] **Step 1: Update the "emits SQL" / shape assertions.** In the test that currently asserts (lines 65–66):
  ```js
  expect(sql).toMatch(/date_trunc\('day'/i);
  expect(sql).toMatch(/SUM\(amount\) OVER \(ORDER BY day\)/i);
  ```
  Replace the second assertion (the old window over the sparse `daily`) and add the spine/fill markers. New assertions for the dense query:
  ```js
  expect(sql).toMatch(/date_trunc\('day'/i);                       // daily bucket (kept)
  expect(sql).toMatch(/generate_series/i);                          // spine exists
  expect(sql).toMatch(/now\(\) AT TIME ZONE 'UTC'/i);               // UTC today bound
  expect(sql).toMatch(/LEFT JOIN\s+daily/i);                        // zero-fill join
  expect(sql).toMatch(/SUM\(\s*COALESCE\(daily\.amount,\s*0\)\s*\) OVER \(ORDER BY spine\.day\)/i); // carry-forward
  ```
  Keep the `params` assertion `expect(params).toEqual([42, mfxAddrStr])` and the no-N+1 assertion `expect(migrationRepo.manager.query).toHaveBeenCalledTimes(1)`.

- [ ] **Step 2: Keep the transform test as-is.** The "returns cumulative day-bucketed series in ASC order" test mocks 3 rows with `timestamp`/`cumulative` and asserts the `{timestamps,data}` output. The mock shape is unchanged by this work, so it stays green. (Optionally rename it to reflect that rows are now a dense spine, but the assertions need no change.)

- [ ] **Step 3: Keep the COALESCE-shapes test.** The "COALESCEs symbol/amount across direct and multisig argument shapes" test still applies verbatim — the daily CTE's JSON extraction is unchanged. Leave it.

- [ ] **Step 4: Keep the empty-token + warn-once tests.** "returns empty series when no MFX token exists" (asserts `query` NOT called) and "warns only once when MFX token is missing" are upstream of the SQL and unchanged.

- [ ] **Step 5 (optional, if cheap): add a dense/empty mock test.** Since the actual SQL fill isn't run under mocks, a unit test can't prove the gaps are filled — that's the live-DB job in Task 3. Optionally add a test asserting that when `query` resolves `[]` the result is `{ timestamps: [], data: [] }` (documents the empty-spine contract at the service layer). Don't over-invest; the real coverage is the live-DB verification.

---

## Task 3: Verification (live DB + suites + EXPLAIN)

> The DB container `burned-mfx-db-1` is **read-only** for us — run `SELECT`/`EXPLAIN` only, never mutate. Use `docker exec burned-mfx-db-1 psql -U admin -d talib -c '...'`.

### A. Live-DB accuracy (neighborhood 1)
Run the **new** query (or its building blocks) against the live DB and confirm:

- [ ] **Point count ≈ 351, not 32.** Days from the first migration day (`2025-06-10`) through today UTC inclusive. As of 2026-05-26 that is `date '2026-05-26' - date '2025-06-10' + 1 = 351` rows. Confirm:
  ```sql
  SELECT count(*) FROM ( <new query> ) s;     -- expect ~351
  ```
  (Exact value = `(today_utc::date - 2025-06-10) + 1`; recompute for the actual run date. Must be ≫ 32.)

- [ ] **Total (final cumulative) UNCHANGED.** The last row's `cumulative` must equal the current production total:
  ```
  3469397230140100  uMFX  ( = 3,469,397.23014 MFX )
  ```
  ```sql
  SELECT cumulative FROM ( <new query> ) s ORDER BY timestamp DESC LIMIT 1;  -- expect 3469397230140100
  ```
  Cross-check it equals the **old** sparse query's final value (zero-fill must not change the total).

- [ ] **Monotonic non-decreasing + flat across gaps.** Cumulative never decreases; it is constant across known quiet stretches (e.g. the documented max 172-day gap):
  ```sql
  SELECT bool_and(cumulative >= lag) FROM (
    SELECT cumulative::numeric,
           lag(cumulative::numeric) OVER (ORDER BY timestamp) AS lag
    FROM ( <new query> ) s
  ) q WHERE lag IS NOT NULL;                   -- expect t (true)
  ```

- [ ] **Per-day average corrected to ≈ 9,970 MFX/day (down from 111,916).** The headline figure is `calculateAverageRate(calculateRates(series, "per_day"))`. Over a dense daily spine the `per_day` window baseline is the previous day, so each rate point = that day's burn, and the mean ≈ `total / number_of_days`. Order-of-magnitude check on the DB:
  ```sql
  -- mean of daily increments (uMFX/day), should be ~9.97e9 uMFX = ~9,970 MFX
  SELECT avg(cumulative::numeric - lag) FROM (
    SELECT cumulative::numeric,
           lag(cumulative::numeric) OVER (ORDER BY timestamp) AS lag
    FROM ( <new query> ) s
  ) q WHERE lag IS NOT NULL;
  ```
  Acceptance: result ≈ **9,970 MFX/day** (≈ `9.97e9` uMFX/day), i.e. `total / ~348`. Note the exact client number depends on `calculateRates` skipping the first point (it averages `n-1 ≈ 350` daily diffs whose sum is `total − firstDayBurn`), so expect it to land in the **~9,900–10,000 MFX/day** band — the point is the ~11× correction away from 111,916, and the total being unchanged. Confirm it is NOT ~111,916.

### B. Performance / EXPLAIN
- [ ] **EXPLAIN ANALYZE the new query** on `burned-mfx-db-1` and confirm the structure described in the Performance section: single feed into the `daily` aggregate, `Function Scan` for `generate_series`, a `WindowAgg` over a bounded row set, and **no nested-loop blow-up** multiplying spine rows by migration rows. Capture the plan output for the verification write-up.

### C. Suites + types
- [ ] **Fresh worktree bootstrap.** This worktree needs deps installed before tests run:
  ```bash
  npm install            # repo root
  (cd client && npm install)
  (cd server && npm install)
  ```
- [ ] **Server suite green:** `cd server && npm test` (or the jest invocation used in CI) — the updated `migrations.service.spec.ts` and the rest pass.
- [ ] **Client suite green:** `cd client && npm test` — unchanged, must stay green (no client code changed).
- [ ] **Types clean:** `tsc` clean on server (and client) — `npx tsc --noEmit` in each, or the repo's typecheck script.

### D. Optional end-to-end (only if requested)
- [ ] Rebuild the docker image from this worktree, recreate `talib-app-1` (network `burned-mfx_default`, `-p 3000:3000`, mount `/home/fmorency/dev/talib/.env.dev:/app/server/.env`), and confirm the rate card now shows ~9,970 MFX/day and the cumulative chart is a smooth daily line extending to today. **Do not touch `burned-mfx-db-1`.**

---

## Acceptance summary (the numbers that must hold)

| Check | Before | After (expected) |
|---|---|---|
| Point count (nbhd 1) | 32 | ≈ 351 (`today − 2025-06-10 + 1`) |
| Final cumulative (total) | 3469397230140100 uMFX | **3469397230140100 uMFX (unchanged)** |
| Per-day average | 111,916 MFX/day | ≈ **9,970 MFX/day** (~9,900–10,000 band) |
| SQL round trips per call | 1 | **1** (no N+1) |
| Cumulative across gaps | n/a | monotonic, flat |
| Server / client suites + tsc | green | **green** |

---

## Out of scope (do not change)
- Controller, module, DTOs, `SeriesEntity`, client charts, `calculateRates`/`calculateAverageRate`.
- The bytea→UTF-8 MFX address decode and the Token lookup.
- The missing-token early-return and warn-once logging.
- Any backfill before the first migration day (start = `min(day)`, no genesis backfill — per spec decision).
