# Burned MFX Metric Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two charts to the talib Metrics → Tokenomics section — a cumulative "Burned MFX" series and a configurable-unit "MFX Burn Rate" — both driven by the existing `migration` table.

**Architecture:** New endpoint `GET /neighborhoods/:nid/migrations/burned-mfx/series` on `MigrationsController` returns a day-bucketed cumulative series via a PostgreSQL window function. Two React Apex charts on the client share the same React Query key; the rate chart derives its values from the cumulative series via a ported version of `manifest-dashboard`'s `calculateRates` (two-pointer O(n) differencing). Mainnet neighborhood id is read from `VITE_MFX_NEIGHBORHOOD_ID`.

**Tech Stack:** NestJS + TypeORM + PostgreSQL on the server; React + Apex Charts + React Query on the client; vitest for new client tests; jest for new server tests.

**Spec:** `docs/specs/2026-05-19-burned-mfx-metric-design.md`

---

## File Map

**Server (modified):**
- `server/src/neighborhoods/migrations/migrations.module.ts` — add `Token` to `forFeature`.
- `server/src/neighborhoods/migrations/migrations.service.ts` — add `getBurnedMfxSeries(nid)` + private MFX-address resolver.
- `server/src/neighborhoods/migrations/migrations.controller.ts` — add `GET burned-mfx/series` route.

**Server (created):**
- `server/src/neighborhoods/migrations/migrations.service.spec.ts` — unit tests for the new method.
- `server/src/neighborhoods/migrations/migrations.controller.spec.ts` — supertest smoke + no-N+1 check.

**Client (created):**
- `client/src/utils/burn-rate.ts` — `calculateRates` pure function + `RateUnit` type + `RATE_UNIT_LABELS` map.
- `client/src/utils/burn-rate.spec.ts` — unit tests.
- `client/src/ui/burned-mfx-cumulative-chart.tsx` — area chart component.
- `client/src/ui/burned-mfx-cumulative-chart.spec.tsx` — component test.
- `client/src/ui/burned-mfx-rate-chart.tsx` — area chart + unit dropdown.
- `client/src/ui/burned-mfx-rate-chart.spec.tsx` — component test.
- `client/vitest.config.ts` — vitest config (also wires the existing `setupTests.ts`).

**Client (modified):**
- `client/package.json` — add `vitest`, `jsdom`, and a `test` script.
- `client/src/api/queries.ts` — add `getBurnedMfxSeries`.
- `client/src/ui/index.ts` — re-export the two new components.
- `client/src/pages/metrics/networkMetrics.tsx` — render the two new cells inside Tokenomics, with env-guard.
- `client/.env` — add `VITE_MFX_NEIGHBORHOOD_ID`.
- `client/README.md` — document the new env var.

---

## Task 0: Set up vitest as the client test runner

The client already has `@testing-library/react`, `@testing-library/jest-dom`, and `@types/jest` installed, plus a `setupTests.ts` file, but no actual test runner is configured. Add vitest (the natural fit for a Vite project) before any client unit tests can run.

**Files:**
- Create: `client/vitest.config.ts`
- Modify: `client/package.json`
- Modify: `client/src/setupTests.ts` (no content change, just verified)

- [ ] **Step 1: Install vitest + jsdom**

Run:
```bash
cd client && npm install --save-dev vitest@^2 jsdom @vitest/coverage-v8
```
Expected: deps added to `package.json` and `package-lock.json` updated.

- [ ] **Step 2: Create `client/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    css: false,
  },
});
```

- [ ] **Step 3: Add a `test` script to `client/package.json`**

In the `"scripts"` block, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write a smoke test to confirm vitest is wired up**

Create `client/src/setupTests.spec.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("vitest smoke", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 5: Run the smoke test**

Run: `cd client && npm test`
Expected: PASS, 1 test in `src/setupTests.spec.ts`.

- [ ] **Step 6: Delete the smoke test**

```bash
rm client/src/setupTests.spec.ts
```

- [ ] **Step 7: Commit**

```bash
git add client/package.json client/package-lock.json client/vitest.config.ts
git commit -m "chore(client): wire vitest as the client test runner"
```

---

## Task 1: Wire `Token` into `MigrationsModule`

Make the `Token` repository injectable in `MigrationsService` so the new method can resolve the MFX token address.

**Files:**
- Modify: `server/src/neighborhoods/migrations/migrations.module.ts`

- [ ] **Step 1: Add `Token` to `forFeature(...)`**

Open `server/src/neighborhoods/migrations/migrations.module.ts`. At the top, add the import:
```ts
import { Token } from "../../database/entities/token.entity";
```

Then change the `imports` line from:
```ts
imports: [TypeOrmModule.forFeature([Migration, Transaction, TransactionDetails, MigrationWhitelist])],
```
to:
```ts
imports: [TypeOrmModule.forFeature([Migration, Transaction, TransactionDetails, MigrationWhitelist, Token])],
```

- [ ] **Step 2: Build the server to confirm no compile error**

Run: `cd server && npm run build`
Expected: build succeeds with no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add server/src/neighborhoods/migrations/migrations.module.ts
git commit -m "chore(server): expose Token repo to MigrationsModule"
```

---

## Task 2: Implement `MigrationsService.getBurnedMfxSeries` (TDD)

Write the failing unit test first, then implement the service method, then verify pass.

**Files:**
- Create: `server/src/neighborhoods/migrations/migrations.service.spec.ts`
- Modify: `server/src/neighborhoods/migrations/migrations.service.ts`

- [ ] **Step 1: Write the failing test**

Create `server/src/neighborhoods/migrations/migrations.service.spec.ts`:

```ts
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Address } from "@liftedinit/many-js";

import { MigrationsService } from "./migrations.service";
import { Migration } from "../../database/entities/migration.entity";
import { Token } from "../../database/entities/token.entity";

describe("MigrationsService.getBurnedMfxSeries", () => {
  let service: MigrationsService;
  let migrationRepo: { manager: { query: jest.Mock } };
  let tokenRepo: { findOne: jest.Mock };

  beforeEach(async () => {
    migrationRepo = { manager: { query: jest.fn() } };
    tokenRepo = { findOne: jest.fn() };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MigrationsService,
        { provide: getRepositoryToken(Migration), useValue: migrationRepo },
        { provide: getRepositoryToken(Token), useValue: tokenRepo },
        { provide: DataSource, useValue: {} },
      ],
    }).compile();

    service = moduleRef.get(MigrationsService);
  });

  it("returns empty series when no MFX token exists for the neighborhood", async () => {
    tokenRepo.findOne.mockResolvedValueOnce(null);

    const result = await service.getBurnedMfxSeries(42);

    expect(result).toEqual({ timestamps: [], data: [] });
    expect(migrationRepo.manager.query).not.toHaveBeenCalled();
  });

  it("returns cumulative day-bucketed series in ASC order", async () => {
    const mfxAddrBytes = Buffer.from([0x00, 0x01, 0x02, 0x03]);
    const mfxAddrStr = new Address(mfxAddrBytes).toString();

    tokenRepo.findOne.mockResolvedValueOnce({ address: mfxAddrBytes });
    migrationRepo.manager.query.mockResolvedValueOnce([
      { timestamp: new Date("2026-01-01"), cumulative: "100" },
      { timestamp: new Date("2026-01-02"), cumulative: "250" },
      { timestamp: new Date("2026-01-03"), cumulative: "400" },
    ]);

    const result = await service.getBurnedMfxSeries(42);

    expect(result.timestamps.map((d) => d.toISOString())).toEqual([
      "2026-01-01T00:00:00.000Z",
      "2026-01-02T00:00:00.000Z",
      "2026-01-03T00:00:00.000Z",
    ]);
    expect(result.data).toEqual(["100", "250", "400"]);

    // No-N+1: at most 1 SQL after the Token lookup.
    expect(migrationRepo.manager.query).toHaveBeenCalledTimes(1);
    const [sql, params] = migrationRepo.manager.query.mock.calls[0];
    expect(sql).toMatch(/date_trunc\('day'/i);
    expect(sql).toMatch(/SUM\(amount\) OVER \(ORDER BY day\)/i);
    expect(params).toEqual([42, mfxAddrStr]);
  });

  it("warns only once when MFX token is missing across multiple calls", async () => {
    tokenRepo.findOne.mockResolvedValue(null);
    const warnSpy = jest.spyOn(service["logger"], "warn").mockImplementation(() => {});

    await service.getBurnedMfxSeries(42);
    await service.getBurnedMfxSeries(42);
    await service.getBurnedMfxSeries(42);

    expect(warnSpy).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd server && npx jest src/neighborhoods/migrations/migrations.service.spec.ts -v`
Expected: FAIL — `service.getBurnedMfxSeries is not a function`.

- [ ] **Step 3: Implement `getBurnedMfxSeries`**

Open `server/src/neighborhoods/migrations/migrations.service.ts`. Add these imports near the top:

```ts
import { Address } from "@liftedinit/many-js";
import { Token } from "../../database/entities/token.entity";
import { SeriesEntity } from "../../metrics/metrics.service";
```

Add `Token` to the constructor:

```ts
constructor(
  @InjectRepository(MigrationEntity)
  private migrationRepository: Repository<MigrationEntity>,
  @InjectRepository(Token)
  private tokenRepository: Repository<Token>,
  private datasource: DataSource,
) {}
```

Add a private flag for the warn-once behavior, immediately under the existing `private readonly logger`:

```ts
private mfxTokenMissingWarned = false;
```

Then add the new method (place it after `findOneByUuid`):

```ts
async getBurnedMfxSeries(neighborhoodId: number): Promise<SeriesEntity> {
  const tokenRow = await this.tokenRepository.findOne({
    where: { neighborhood: { id: neighborhoodId }, symbol: "MFX" },
  });

  if (!tokenRow) {
    if (!this.mfxTokenMissingWarned) {
      this.logger.warn(
        `No MFX token row for neighborhood ${neighborhoodId}; returning empty burned-MFX series.`,
      );
      this.mfxTokenMissingWarned = true;
    }
    return { timestamps: [], data: [] };
  }

  const mfxAddressStr = new Address(
    Buffer.from(tokenRow.address as ArrayBuffer),
  ).toString();

  const rows = await this.migrationRepository.manager.query(
    `
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
      ORDER BY day ASC
    `,
    [neighborhoodId, mfxAddressStr],
  );

  return {
    timestamps: rows.map((r: { timestamp: Date }) => r.timestamp),
    data: rows.map((r: { cumulative: string }) => r.cumulative),
  };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `cd server && npx jest src/neighborhoods/migrations/migrations.service.spec.ts -v`
Expected: PASS — all three tests green.

- [ ] **Step 5: Commit**

```bash
git add server/src/neighborhoods/migrations/migrations.service.ts \
        server/src/neighborhoods/migrations/migrations.service.spec.ts
git commit -m "feat(server): add MigrationsService.getBurnedMfxSeries"
```

---

## Task 3: Add the controller endpoint (TDD)

**Files:**
- Create: `server/src/neighborhoods/migrations/migrations.controller.spec.ts`
- Modify: `server/src/neighborhoods/migrations/migrations.controller.ts`

- [ ] **Step 1: Write the failing controller test**

Create `server/src/neighborhoods/migrations/migrations.controller.spec.ts`:

```ts
import { Test, TestingModule } from "@nestjs/testing";
import { MigrationsController } from "./migrations.controller";
import { MigrationsService } from "./migrations.service";

describe("MigrationsController.getBurnedMfxSeries", () => {
  let controller: MigrationsController;
  let service: { getBurnedMfxSeries: jest.Mock };

  beforeEach(async () => {
    service = { getBurnedMfxSeries: jest.fn() };

    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MigrationsController],
      providers: [{ provide: MigrationsService, useValue: service }],
    }).compile();

    controller = moduleRef.get(MigrationsController);
  });

  it("delegates to MigrationsService.getBurnedMfxSeries with the nid", async () => {
    const payload = {
      timestamps: [new Date("2026-01-01")],
      data: ["123"],
    };
    service.getBurnedMfxSeries.mockResolvedValueOnce(payload);

    const result = await controller.getBurnedMfxSeries(7);

    expect(service.getBurnedMfxSeries).toHaveBeenCalledWith(7);
    expect(result).toBe(payload);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd server && npx jest src/neighborhoods/migrations/migrations.controller.spec.ts -v`
Expected: FAIL — `controller.getBurnedMfxSeries is not a function`.

- [ ] **Step 3: Implement the route handler**

Open `server/src/neighborhoods/migrations/migrations.controller.ts`. Add this method to the controller (placed before the existing `@Get(":uuid")` route, since NestJS matches routes top-down and a literal segment should come before a param segment):

```ts
@Get("burned-mfx/series")
@ApiOperation({
  description: "Cumulative day-bucketed series of MFX burned via migrations.",
})
async getBurnedMfxSeries(
  @Param("nid", ParseIntPipe) nid: number,
) {
  return this.migrations.getBurnedMfxSeries(nid);
}
```

- [ ] **Step 4: Run the controller test to verify it passes**

Run: `cd server && npx jest src/neighborhoods/migrations/migrations.controller.spec.ts -v`
Expected: PASS.

- [ ] **Step 5: Re-run the full migrations spec set to confirm no regressions**

Run: `cd server && npx jest src/neighborhoods/migrations -v`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add server/src/neighborhoods/migrations/migrations.controller.ts \
        server/src/neighborhoods/migrations/migrations.controller.spec.ts
git commit -m "feat(server): GET /neighborhoods/:nid/migrations/burned-mfx/series"
```

---

## Task 4: Client config — env var + README

**Files:**
- Modify: `client/.env`
- Modify: `client/README.md`

> `calculateRates` uses native `BigInt`, so no `bignumber.js` install is needed.

- [ ] **Step 1: Add the env var to `client/.env`**

Append to `client/.env`:
```
VITE_MFX_NEIGHBORHOOD_ID=1
```
(`1` is a placeholder for local dev — the real mainnet id is set per environment.)

- [ ] **Step 2: Document the env var in `client/README.md`**

At the very bottom of `client/README.md`, append:

```markdown
## Environment variables

- `VITE_API_PATH` — base path for talib's REST API (e.g. `/api/v1`).
- `VITE_MFX_NEIGHBORHOOD_ID` — numeric id of the neighborhood whose MFX migrations feed the "Burned MFX" charts on the metrics page.
```

- [ ] **Step 3: Commit**

```bash
git add client/.env client/README.md
git commit -m "chore(client): add VITE_MFX_NEIGHBORHOOD_ID config"
```

---

## Task 5: Client — `calculateRates` utility (TDD)

Port `calculateRates` from `manifest-dashboard/src/lib/utils/rateCalculation.ts`, scoped to the rate units the spec calls out (per_hour / per_day / per_week / per_month).

**Files:**
- Create: `client/src/utils/burn-rate.ts`
- Create: `client/src/utils/burn-rate.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `client/src/utils/burn-rate.spec.ts`:

```ts
import { describe, it, expect } from "vitest";
import { calculateRates, type CumulativePoint, type RateUnit } from "./burn-rate";

const point = (date: string, value: string): CumulativePoint => ({
  date: new Date(date),
  value,
});

describe("calculateRates", () => {
  it("returns [] for empty input", () => {
    expect(calculateRates([], "per_day")).toEqual([]);
  });

  it("returns [] for a single data point", () => {
    expect(calculateRates([point("2026-01-01", "10")], "per_day")).toEqual([]);
  });

  it("computes per-day diffs over monotonic cumulative data (ASC input)", () => {
    const result = calculateRates(
      [
        point("2026-01-01", "100"),
        point("2026-01-02", "250"),
        point("2026-01-03", "400"),
      ],
      "per_day",
    );

    expect(result.map((p) => p.value)).toEqual(["150", "150"]);
    expect(result.map((p) => p.date.toISOString())).toEqual([
      "2026-01-02T00:00:00.000Z",
      "2026-01-03T00:00:00.000Z",
    ]);
  });

  it("clamps negative diffs (non-monotonic cumulative) to 0", () => {
    const result = calculateRates(
      [
        point("2026-01-01", "100"),
        point("2026-01-02", "80"),
      ],
      "per_day",
    );

    expect(result.map((p) => p.value)).toEqual(["0"]);
  });

  it("skips entries where the window extends before the available data", () => {
    const result = calculateRates(
      [
        point("2026-01-01", "100"),
        point("2026-01-02", "200"),
      ],
      "per_week",
    );

    expect(result).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd client && npm test -- burn-rate.spec.ts`
Expected: FAIL — module `./burn-rate` not found.

- [ ] **Step 3: Implement `calculateRates`**

Create `client/src/utils/burn-rate.ts`:

```ts
export type RateUnit = "per_hour" | "per_day" | "per_week" | "per_month";

export interface CumulativePoint {
  date: Date;
  value: string;
}

const AVERAGE_DAYS_PER_MONTH = 30.44;

export const MS_PER_UNIT: Record<RateUnit, number> = {
  per_hour: 60 * 60 * 1000,
  per_day: 24 * 60 * 60 * 1000,
  per_week: 7 * 24 * 60 * 60 * 1000,
  per_month: AVERAGE_DAYS_PER_MONTH * 24 * 60 * 60 * 1000,
};

export const RATE_UNIT_LABELS: Record<RateUnit, string> = {
  per_hour: "Per Hour",
  per_day: "Per Day",
  per_week: "Per Week",
  per_month: "Per Month",
};

export const RATE_UNIT_OPTIONS: RateUnit[] = [
  "per_hour",
  "per_day",
  "per_week",
  "per_month",
];

/**
 * Differencing over a sorted (ASC) cumulative series.
 * For each point i, find the latest point j < i with date <= date[i] - windowMs
 * and emit (value[i] - value[j]). Two-pointer, O(n).
 * Negative diffs clamped to 0. Uses native BigInt — values are integer
 * uMFX strings so subtraction is exact and zero-dep.
 */
export function calculateRates(
  data: CumulativePoint[],
  rateUnit: RateUnit,
): CumulativePoint[] {
  if (!data || data.length < 2) return [];

  const windowMs = MS_PER_UNIT[rateUnit];
  const out: CumulativePoint[] = [];

  let j = 0;
  for (let i = 1; i < data.length; i++) {
    const current = data[i];
    const windowStartTime = current.date.getTime() - windowMs;

    // Advance j as far as it can go while staying <= windowStartTime
    while (j + 1 < i && data[j + 1].date.getTime() <= windowStartTime) {
      j++;
    }

    if (data[j].date.getTime() > windowStartTime) {
      // No baseline point old enough — skip.
      continue;
    }

    const diff = BigInt(current.value) - BigInt(data[j].value);
    const rate = diff < 0n ? 0n : diff;

    out.push({ date: current.date, value: rate.toString() });
  }

  return out;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd client && npm test -- burn-rate.spec.ts`
Expected: PASS — all five tests green.

- [ ] **Step 5: Commit**

```bash
git add client/src/utils/burn-rate.ts client/src/utils/burn-rate.spec.ts
git commit -m "feat(client): add calculateRates utility for burn-rate derivation"
```

---

## Task 6: Client — API helper `getBurnedMfxSeries`

**Files:**
- Modify: `client/src/api/queries.ts`

- [ ] **Step 1: Add the helper**

In `client/src/api/queries.ts`, immediately after `getNeighborhoodMigration`, add:

```ts
export function getBurnedMfxSeries(nid: number) {
  return get(`neighborhoods/${nid}/migrations/burned-mfx/series`);
}
```

- [ ] **Step 2: Commit**

```bash
git add client/src/api/queries.ts
git commit -m "feat(client): API helper for burned-mfx series"
```

---

## Task 7: Client — `BurnedMfxCumulativeChart` (TDD)

**Files:**
- Create: `client/src/ui/burned-mfx-cumulative-chart.tsx`
- Create: `client/src/ui/burned-mfx-cumulative-chart.spec.tsx`
- Modify: `client/src/ui/index.ts`

- [ ] **Step 1: Write the failing test**

Create `client/src/ui/burned-mfx-cumulative-chart.spec.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BurnedMfxCumulativeChart } from "./burned-mfx-cumulative-chart";

vi.mock("react-apexcharts", () => ({
  default: (props: any) => (
    <div data-testid="apex" data-series={JSON.stringify(props.series)} />
  ),
}));

vi.mock("api", () => ({
  getBurnedMfxSeries: vi.fn(),
}));

import { getBurnedMfxSeries } from "api";

function wrap(ui: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{ui}</QueryClientProvider>;
}

describe("BurnedMfxCumulativeChart", () => {
  beforeEach(() => {
    vi.mocked(getBurnedMfxSeries).mockReset();
  });

  it("renders the empty state when the series has no points", async () => {
    vi.mocked(getBurnedMfxSeries).mockReturnValueOnce(
      async () => ({ timestamps: [], data: [] }),
    );

    render(wrap(<BurnedMfxCumulativeChart nid={1} />));

    expect(await screen.findByText(/no migrations yet/i)).toBeInTheDocument();
  });

  it("plots uMFX divided by 1e6 with a cumulative-MFX label", async () => {
    vi.mocked(getBurnedMfxSeries).mockReturnValueOnce(
      async () => ({
        timestamps: [new Date("2026-01-01"), new Date("2026-01-02")],
        data: ["1000000", "3000000"],
      }),
    );

    render(wrap(<BurnedMfxCumulativeChart nid={1} />));

    const apex = await screen.findByTestId("apex");
    const series = JSON.parse(apex.getAttribute("data-series")!);
    expect(series).toEqual([{ name: "Burned MFX", data: [1, 3] }]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd client && npm test -- burned-mfx-cumulative-chart.spec.tsx`
Expected: FAIL — module `./burned-mfx-cumulative-chart` not found.

- [ ] **Step 3: Implement the component**

Create `client/src/ui/burned-mfx-cumulative-chart.tsx`:

```tsx
import React from "react";
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { Box, Center, Spinner, Text } from "@liftedinit/ui";
import { getBurnedMfxSeries } from "api";
import { useBgColor, LONG_STALE_INTERVAL, LONG_REFRESH_INTERVAL } from "utils";

interface Props {
  nid: number;
}

interface SeriesPayload {
  timestamps: (string | Date)[];
  data: string[];
}

const UMFX_PER_MFX = 1_000_000;

export function BurnedMfxCumulativeChart({ nid }: Props) {
  const bg = useBgColor();

  const { data, isLoading, isError } = useQuery<SeriesPayload>(
    ["neighborhoods", nid, "migrations", "burned-mfx", "series"],
    getBurnedMfxSeries(nid),
    {
      staleTime: LONG_STALE_INTERVAL,
      refetchInterval: LONG_REFRESH_INTERVAL,
    },
  );

  if (isLoading) {
    return (
      <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
        <Center h="100%"><Spinner /></Center>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
        <Center h="100%">
          <Text color="brand.teal" fontWeight="bold">Error loading chart data</Text>
        </Center>
      </Box>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
        <Center h="100%"><Text color="brand.teal">No migrations yet</Text></Center>
      </Box>
    );
  }

  const seriesMfx = data.data.map((v) => Number(v) / UMFX_PER_MFX);
  const categories = data.timestamps.map((t) =>
    t instanceof Date ? t.toISOString() : t,
  );

  return (
    <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
      <Chart
        height="100%"
        type="area"
        series={[{ name: "Burned MFX", data: seriesMfx }]}
        options={{
          colors: ["#38C7B4"],
          dataLabels: { enabled: false },
          chart: { toolbar: { show: false }, animations: { enabled: false } },
          stroke: { curve: "smooth" },
          xaxis: {
            type: "datetime",
            categories,
            labels: {
              datetimeFormatter: { year: "yy", month: "MMM", day: "dd", hour: "HH:mm" },
            },
          },
          yaxis: {
            title: { text: "MFX", style: { fontSize: "1.25em", fontFamily: "Rubik, sans-serif" } },
          },
        }}
        className="talib-chart"
      />
    </Box>
  );
}

export const MemoizedBurnedMfxCumulativeChart = React.memo(BurnedMfxCumulativeChart);
```

- [ ] **Step 4: Export from `client/src/ui/index.ts`**

Append to `client/src/ui/index.ts`:
```ts
export { BurnedMfxCumulativeChart, MemoizedBurnedMfxCumulativeChart } from "./burned-mfx-cumulative-chart";
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd client && npm test -- burned-mfx-cumulative-chart.spec.tsx`
Expected: PASS — both tests green.

- [ ] **Step 6: Commit**

```bash
git add client/src/ui/burned-mfx-cumulative-chart.tsx \
        client/src/ui/burned-mfx-cumulative-chart.spec.tsx \
        client/src/ui/index.ts
git commit -m "feat(client): BurnedMfxCumulativeChart component"
```

---

## Task 8: Client — `BurnedMfxRateChart` (TDD)

**Files:**
- Create: `client/src/ui/burned-mfx-rate-chart.tsx`
- Create: `client/src/ui/burned-mfx-rate-chart.spec.tsx`
- Modify: `client/src/ui/index.ts`

- [ ] **Step 1: Write the failing test**

Create `client/src/ui/burned-mfx-rate-chart.spec.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BurnedMfxRateChart } from "./burned-mfx-rate-chart";

vi.mock("react-apexcharts", () => ({
  default: (props: any) => (
    <div data-testid="apex" data-series={JSON.stringify(props.series)} />
  ),
}));

vi.mock("api", () => ({
  getBurnedMfxSeries: vi.fn(),
}));

import { getBurnedMfxSeries } from "api";

function wrap(ui: React.ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{ui}</QueryClientProvider>;
}

const fourDays = {
  timestamps: [
    new Date("2026-01-01"),
    new Date("2026-01-02"),
    new Date("2026-01-03"),
    new Date("2026-01-04"),
  ],
  data: ["1000000", "3000000", "6000000", "10000000"],
};

describe("BurnedMfxRateChart", () => {
  beforeEach(() => {
    vi.mocked(getBurnedMfxSeries).mockReset();
  });

  it("defaults to per_day and renders day-over-day diffs in MFX", async () => {
    vi.mocked(getBurnedMfxSeries).mockReturnValueOnce(async () => fourDays);

    render(wrap(<BurnedMfxRateChart nid={1} />));

    const apex = await screen.findByTestId("apex");
    const series = JSON.parse(apex.getAttribute("data-series")!);
    expect(series[0].data).toEqual([2, 3, 4]);
  });

  it("re-renders rates when the dropdown changes unit", async () => {
    vi.mocked(getBurnedMfxSeries).mockReturnValueOnce(async () => fourDays);

    render(wrap(<BurnedMfxRateChart nid={1} />));

    await screen.findByTestId("apex");
    await userEvent.selectOptions(screen.getByRole("combobox"), "per_week");

    const apex = screen.getByTestId("apex");
    const series = JSON.parse(apex.getAttribute("data-series")!);
    expect(series[0].data).toEqual([]);
  });

  it("shows 'Insufficient data' when fewer than two points", async () => {
    vi.mocked(getBurnedMfxSeries).mockReturnValueOnce(
      async () => ({ timestamps: [new Date("2026-01-01")], data: ["1000000"] }),
    );

    render(wrap(<BurnedMfxRateChart nid={1} />));

    expect(await screen.findByText(/insufficient data/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd client && npm test -- burned-mfx-rate-chart.spec.tsx`
Expected: FAIL — module `./burned-mfx-rate-chart` not found.

- [ ] **Step 3: Implement the component**

Create `client/src/ui/burned-mfx-rate-chart.tsx`:

```tsx
import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { Box, Center, Select, Spinner, Text, Flex } from "@liftedinit/ui";
import { getBurnedMfxSeries } from "api";
import { useBgColor, LONG_STALE_INTERVAL, LONG_REFRESH_INTERVAL } from "utils";
import {
  calculateRates,
  RATE_UNIT_LABELS,
  RATE_UNIT_OPTIONS,
  type CumulativePoint,
  type RateUnit,
} from "utils/burn-rate";

interface Props {
  nid: number;
}

interface SeriesPayload {
  timestamps: (string | Date)[];
  data: string[];
}

const UMFX_PER_MFX = 1_000_000;

export function BurnedMfxRateChart({ nid }: Props) {
  const bg = useBgColor();
  const [rateUnit, setRateUnit] = useState<RateUnit>("per_day");

  const { data, isLoading, isError } = useQuery<SeriesPayload>(
    ["neighborhoods", nid, "migrations", "burned-mfx", "series"],
    getBurnedMfxSeries(nid),
    {
      staleTime: LONG_STALE_INTERVAL,
      refetchInterval: LONG_REFRESH_INTERVAL,
    },
  );

  const cumulative: CumulativePoint[] = useMemo(() => {
    if (!data) return [];
    return data.timestamps.map((t, i) => ({
      date: t instanceof Date ? t : new Date(t),
      value: data.data[i],
    }));
  }, [data]);

  const rates = useMemo(
    () => calculateRates(cumulative, rateUnit),
    [cumulative, rateUnit],
  );

  if (isLoading) {
    return (
      <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
        <Center h="100%"><Spinner /></Center>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
        <Center h="100%">
          <Text color="brand.teal" fontWeight="bold">Error loading chart data</Text>
        </Center>
      </Box>
    );
  }

  if (!data || data.data.length < 2) {
    return (
      <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
        <Center h="100%"><Text color="brand.teal">Insufficient data</Text></Center>
      </Box>
    );
  }

  const seriesMfx = rates.map((p) => Number(p.value) / UMFX_PER_MFX);
  const categories = rates.map((p) => p.date.toISOString());

  return (
    <Box p={4} bg={bg} h={["200px", "300px", "400px"]}>
      <Flex justify="flex-end" mb={2}>
        <Select
          size="sm"
          width="auto"
          value={rateUnit}
          onChange={(e) => setRateUnit(e.target.value as RateUnit)}
        >
          {RATE_UNIT_OPTIONS.map((u) => (
            <option key={u} value={u}>{RATE_UNIT_LABELS[u]}</option>
          ))}
        </Select>
      </Flex>
      <Chart
        height="85%"
        type="area"
        series={[{ name: `MFX ${RATE_UNIT_LABELS[rateUnit]}`, data: seriesMfx }]}
        options={{
          colors: ["#38C7B4"],
          dataLabels: { enabled: false },
          chart: { toolbar: { show: false }, animations: { enabled: false } },
          stroke: { curve: "smooth" },
          xaxis: {
            type: "datetime",
            categories,
            labels: {
              datetimeFormatter: { year: "yy", month: "MMM", day: "dd", hour: "HH:mm" },
            },
          },
          yaxis: {
            title: { text: "MFX", style: { fontSize: "1.25em", fontFamily: "Rubik, sans-serif" } },
          },
        }}
        className="talib-chart"
      />
    </Box>
  );
}

export const MemoizedBurnedMfxRateChart = React.memo(BurnedMfxRateChart);
```

- [ ] **Step 4: Export from `client/src/ui/index.ts`**

Append to `client/src/ui/index.ts`:
```ts
export { BurnedMfxRateChart, MemoizedBurnedMfxRateChart } from "./burned-mfx-rate-chart";
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd client && npm test -- burned-mfx-rate-chart.spec.tsx`
Expected: PASS — all three tests green.

- [ ] **Step 6: Commit**

```bash
git add client/src/ui/burned-mfx-rate-chart.tsx \
        client/src/ui/burned-mfx-rate-chart.spec.tsx \
        client/src/ui/index.ts
git commit -m "feat(client): BurnedMfxRateChart with rate-unit dropdown"
```

---

## Task 9: Wire the two charts into the Tokenomics section

**Files:**
- Modify: `client/src/pages/metrics/networkMetrics.tsx`

- [ ] **Step 1: Add imports**

At the top of `client/src/pages/metrics/networkMetrics.tsx`, extend the import from `"ui"` with the two new memoized chart components, and ensure `Box`, `Center`, and `Text` are pulled from `@liftedinit/ui` (add the line if it isn't already there — the file likely uses `Box` already):

```ts
import { Box, Center, Text } from "@liftedinit/ui";  // add if not present
import {
  MemoizedMetricChart as MetricChart,
  MemoizedMetricStat as MetricStat,
  MemoizedBurnedMfxCumulativeChart as BurnedMfxCumulativeChart,
  MemoizedBurnedMfxRateChart as BurnedMfxRateChart,
} from "ui";
```

Note: we deliberately do NOT import `ErrorAlert` here — the env-guard fallback uses an inline centered teal-text block matching the chart's own empty/error UI (see Step 3).

- [ ] **Step 2: Resolve and validate `VITE_MFX_NEIGHBORHOOD_ID`**

Immediately above the `NetworkMetrics` function, add:

```ts
const RAW_MFX_NID = import.meta.env.VITE_MFX_NEIGHBORHOOD_ID;
const MFX_NEIGHBORHOOD_ID =
  RAW_MFX_NID !== undefined && RAW_MFX_NID !== "" ? Number(RAW_MFX_NID) : NaN;
const MFX_CONFIG_OK = Number.isFinite(MFX_NEIGHBORHOOD_ID) && MFX_NEIGHBORHOOD_ID > 0;
```

The `!== ""` and `> 0` checks harden the guard against an empty-string env var or a `0` / negative neighborhood id — both would otherwise pass `Number.isFinite` but are non-sensical here.

- [ ] **Step 3: Render the two cells inside the Tokenomics SimpleGrid**

In `networkMetrics.tsx`, inside the `id="tokenomics"` `SimpleGrid`, immediately after the existing `<Box>` containing `<MetricStat label="Total Tokens" ...>`, add:

```tsx
<Box backgroundColor="transparent">
  {MFX_CONFIG_OK ? (
    <BurnedMfxCumulativeChart nid={MFX_NEIGHBORHOOD_ID} />
  ) : (
    <Box p={4} h={["200px", "300px", "400px"]}>
      <Center h="100%">
        <Text color="brand.teal">Burned MFX chart not configured</Text>
      </Center>
    </Box>
  )}
</Box>
<Box backgroundColor="transparent">
  {MFX_CONFIG_OK ? (
    <BurnedMfxRateChart nid={MFX_NEIGHBORHOOD_ID} />
  ) : (
    <Box p={4} h={["200px", "300px", "400px"]}>
      <Center h="100%">
        <Text color="brand.teal">Burned MFX chart not configured</Text>
      </Center>
    </Box>
  )}
</Box>
```

The fallback intentionally matches the chart's own empty-state UI (centered teal text inside a same-height box) so the layout doesn't jump between misconfigured and configured rendering.

- [ ] **Step 4: Confirm the client builds**

Run: `cd client && npm run build`
Expected: build completes with no TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add client/src/pages/metrics/networkMetrics.tsx
git commit -m "feat(client): render burned-MFX cumulative and rate charts in Tokenomics"
```

---

## Task 10: Manual verification

End-to-end check against the running stack. This is the only feature-correctness signal that doesn't come from automated tests.

- [ ] **Step 1: Start the dev stack**

Run: `docker-compose up -d` from the repo root.
Expected: server, client, and postgres containers come up healthy.

- [ ] **Step 2: Confirm seeded migrations exist for the chosen neighborhood**

Run:
```bash
docker-compose exec db psql -U admin -d talib -c \
  "SELECT count(*) AS completed FROM migration m
   INNER JOIN transaction t ON t.id = m.\"transactionId\"
   INNER JOIN block b ON b.id = t.\"blockId\"
   WHERE m.\"manifestDatetime\" IS NOT NULL AND b.\"neighborhoodId\" = 1;"
```
Expected: a non-zero `completed` count (matches `VITE_MFX_NEIGHBORHOOD_ID`).

- [ ] **Step 3: Hit the new endpoint directly**

Run: `curl http://localhost:3000/api/v1/neighborhoods/1/migrations/burned-mfx/series | jq .`
Expected: JSON shaped `{ "timestamps": [...], "data": [...] }`, both arrays the same length, `data` strings, monotonic non-decreasing.

- [ ] **Step 4: Open the metrics page**

Browse to the metrics page in your browser. Confirm:
- Both burned-MFX charts render inside the Tokenomics section.
- Cumulative chart climbs over time.
- Rate-unit dropdown switches between Per Hour / Per Day / Per Week / Per Month, and the rate chart re-renders.
- DevTools → Network tab: exactly **one** request to `/migrations/burned-mfx/series` per page load (proves the shared React Query key works).

- [ ] **Step 5: Verify the env-guard**

Comment out `VITE_MFX_NEIGHBORHOOD_ID` in `client/.env`, restart the client (`docker-compose restart client` or `npm start`), reload the metrics page.
Expected: both burned-MFX cells render the `ErrorAlert` ("Burned MFX chart not configured").

Restore the env var after this check.

- [ ] **Step 6: Profile the SQL (optional)**

If the dataset is large, attach to postgres and run:
```sql
EXPLAIN ANALYZE
WITH daily AS (
  SELECT date_trunc('day', m."manifestDatetime") AS day,
         SUM((COALESCE(
           td.argument ->> 'amount',
           td.argument -> 'transaction' -> 'argument' ->> 'amount'
         ))::numeric) AS amount
  FROM migration m
  INNER JOIN transaction_details td ON td.id = m."detailsId"
  INNER JOIN transaction t          ON t.id  = m."transactionId"
  INNER JOIN block b                ON b.id  = t."blockId" AND b."neighborhoodId" = 1
  WHERE m."manifestDatetime" IS NOT NULL
    AND COALESCE(
      td.argument ->> 'symbol',
      td.argument -> 'transaction' -> 'argument' ->> 'symbol'
    ) = '<MFX address string>'
  GROUP BY date_trunc('day', m."manifestDatetime")
)
SELECT day, SUM(amount) OVER (ORDER BY day) FROM daily ORDER BY day ASC;
```
If a seq scan on `migration` dominates, add the partial index from the spec:
```sql
CREATE INDEX IF NOT EXISTS idx_migration_manifest_datetime_not_null
  ON migration ("manifestDatetime")
  WHERE "manifestDatetime" IS NOT NULL;
```
Commit the index as a separate migration if needed.

- [ ] **Step 7: Final commit (no-op if nothing changed)**

Only commit at this step if the manual verification surfaced and you fixed an issue inline. Otherwise skip.

---

## Done

All spec requirements are covered: cumulative chart, rate chart with per_hour/per_day/per_week/per_month dropdown, MFX-only filter via Token table lookup, completed migrations only (`manifestDatetime IS NOT NULL`), hard-coded neighborhood via `VITE_MFX_NEIGHBORHOOD_ID`, single HTTP call shared between both charts, no-N+1 verification on the server, env-guard error rendering on the client.
