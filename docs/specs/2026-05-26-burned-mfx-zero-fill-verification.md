# Verification report: zero-fill the burned-MFX series

**Date:** 2026-05-26
**Verifier:** QA
**Verdict:** ✅ **PASS** — all in-scope checks green.
**Commit under test:** `5b2cfff` (`feat(burned-mfx): zero-fill the burned-MFX series with a dense daily spine`) on `feat/burned-mfx-zero-fill`.
**Design spec:** [2026-05-26-burned-mfx-zero-fill-design.md](./2026-05-26-burned-mfx-zero-fill-design.md)

Scope of the change (`git diff d13672e..HEAD`): only
`server/src/neighborhoods/migrations/migrations.service.ts` (SQL replaced) and
`migrations.service.spec.ts` (assertions updated + empty-case test). Endpoint shape,
controller, transform, and both client charts unchanged.

---

## 1. Live-DB accuracy — `burned-mfx-db-1`, neighborhood 1 (read-only)

Ran the implemented query directly against the live DB (MFX symbol/address for
neighborhood 1 = `mqbh742x4s356ddaryrxaowt4wxtlocekzpufodvowrirfrqaaaaa3l`).

| Check | Expected | Measured | Result |
|---|---|---|---|
| Dense point count | ≈351 (2025-06-10 → today UTC, inclusive), not 32 | **351** (first 2025-06-10, last 2026-05-26) | ✅ |
| Old sparse active days | 32 | 32 | ✅ (baseline) |
| Cumulative monotonic non-decreasing | 0 decreasing steps | **0** decreasing steps | ✅ |
| Flat across gaps | flat on zero-burn days | **319 flat steps + 31 increasing** (+ first-day baseline = 32 active days) | ✅ |
| Final cumulative UNCHANGED | 3469397230140100 uMFX | dense = sparse = **3469397230140100** uMFX (= **3,469,397.23014 MFX**) | ✅ exact cross-check |

### Recomputed per-day rate (using the real client `calculateRates` + `calculateAverageRate`)

The actual client functions from `client/src/utils/burn-rate.ts` were run over the live
series (both old sparse and new dense), exported as JSON from the DB:

| Series | Points | Final (MFX) | **per_day avg** | per_week | per_month |
|---|---|---|---|---|---|
| SPARSE (old) | 32 | 3,469,397.23014 | **111,916.00742 MFX/day** | 192,805.76 | 402,578.77 |
| DENSE (new) | 351 | 3,469,397.23014 | **9,912.56065 MFX/day** | 70,016.78 | 331,638.38 |

- New per-day average **9,912.56 MFX/day** (`9912560657543` uMFX) — within the
  ~9,900–10,000 band. ✅
- Old per-day average reproduces the design spec's stated wrong figure **111,916**
  exactly. The fix is an **11.29× reduction** (≈ the 11.2-day mean gap). ✅
- Final total identical in both series → cumulative chart value unchanged. ✅

## 2. Performance — `EXPLAIN (ANALYZE, BUFFERS, VERBOSE)`

Plan structure (no nested-loop / N+1 blowup):

- **`CTE daily`** (migration→transaction_details→transaction→block joins) executes
  **once** — `GroupAggregate`, `loops=1`, 32 rows out, driven by 62 filtered migration
  rows via PK index scans. These are the **same joins the old sparse query already used**;
  they are **not** multiplied by the spine.
- **`min(day)`** computed once via `InitPlan 2` (scalar).
- **spine** = `ProjectSet` over `generate_series` → 351 rows (Function-Scan equivalent).
- **spine ⋈ daily** = **`Merge Left Join`**, 351 rows out, 1:1 on `day` — **not** a nested
  loop; no fan-out.
- **`WindowAgg`** `SUM(COALESCE(daily.amount,0)) OVER (ORDER BY spine.day)` over 351 rows,
  Memory 17 kB.
- **Execution Time: 7.101 ms**, Planning 1.212 ms, Buffers shared hit=678 read=72.

Single SQL round trip; single bounded scan + window aggregate. **No N+1, no nested-loop
blowup over the spine.** ✅ Scale note: the spine grows ~1 row/calendar-day (mainnet
~1–2k rows) while the daily-CTE joins scale with *active* migrations, not calendar days —
stays a bounded single-pass plan.

## 3. Test suites + tsc

| Suite / check | Result | Notes |
|---|---|---|
| Server jest (`npm test -w server`) | 9 passed / **1 failed** | only failure = `data/data.controller.spec.ts` (pre-existing, see §4) |
| └ `migrations.service.spec.ts` (in scope) | **5/5 PASS** | incl. new dense-spine empty-case test; SQL-shape assertions updated to `generate_series` / `AT TIME ZONE 'UTC'` / `LEFT JOIN daily` / `SUM(COALESCE(daily.amount,0)) OVER (ORDER BY spine.day)` |
| └ `migrations.controller.spec.ts` | PASS | |
| Server tsc — **build config** (`tsconfig.build.json`, ships) | **exit 0, clean** | the modified service typechecks fine |
| Server tsc — full (`tsconfig.json`, incl. `test/`) | exit 1 | only error = `test/app.e2e-spec.ts` (pre-existing, see §4) |
| Client vitest (`npm test -w client`) | **3 files / 14 tests PASS** | only a non-failing React `act()` warning |
| Client tsc (`tsc --noEmit`) | **exit 0, clean** | |

Everything **in scope is green**.

> Environment note for reviewers: this is an **npm workspaces** monorepo
> (`workspaces: ["client","server"]`). Install with a single `npm ci` / `npm install` at
> the **repo root** — running `npm install` separately inside `client/` and `server/`
> concurrently races on the hoisted root `node_modules` and can leave a half-written
> package (it left `@testing-library/jest-dom`'s nested `dom-accessibility-api` missing
> its `.mjs` files, which broke vitest collection until a clean root `npm ci`).

## 4. Two known pre-existing reds — independently confirmed unrelated

Both failing files are **byte-identical to the parent commit** — `git diff d13672e..HEAD`
shows commit `5b2cfff` touches only the two `migrations.*` files. Neither failing file is
in the diff, so the failures cannot have been introduced by this change.

1. **`server/src/data/data.controller.spec.ts`** — NestJS DI error: `Nest can't resolve
   dependencies of the DataController ... "TransactionDetailsRepository" ... not available
   in the RootTestModule`. Test-module wiring gap, unrelated to burned-MFX.
2. **`server/test/app.e2e-spec.ts(19,12)` TS2349** — `'typeof supertest' has no call
   signatures`. supertest typing issue; only surfaces under the full `tsconfig.json`
   (tests), excluded from the shipping `tsconfig.build.json`.

## Conclusion

The implementation meets the design spec: the series is now a dense daily spine (351
points to today UTC), cumulative is monotonic and flat across gaps, the final total is
provably unchanged at 3,469,397.23014 MFX, the per-day rate drops from the bogus 111,916
to a truthful 9,912.56 MFX/day, the query stays a single bounded scan + window aggregate
(7 ms), and all in-scope tests + typechecks are green. **PASS.**
