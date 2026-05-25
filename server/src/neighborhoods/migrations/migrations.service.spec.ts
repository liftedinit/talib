import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

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
    // Token.address is bytea containing the UTF-8 of the canonical textual
    // address. The service decodes it as UTF-8 and passes the string to SQL.
    const mfxAddrStr =
      "mqbh742x4s356ddaryrxaowt4wxtlocekzpufodvowrirfrqaaaaa3l";
    const mfxAddrBytes = Buffer.from(mfxAddrStr, "utf-8");

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

  it("emits SQL that COALESCEs symbol/amount across direct and multisig argument shapes", async () => {
    const mfxAddrBytes = Buffer.from(
      "mqbh742x4s356ddaryrxaowt4wxtlocekzpufodvowrirfrqaaaaa3l",
      "utf-8",
    );

    tokenRepo.findOne.mockResolvedValueOnce({ address: mfxAddrBytes });
    migrationRepo.manager.query.mockResolvedValueOnce([]);

    await service.getBurnedMfxSeries(42);

    const [sql] = migrationRepo.manager.query.mock.calls[0];

    // Symbol filter must cover both the direct (ledger.send) and the
    // multisig (ledger.send wrapped inside `transaction.argument`) shapes.
    expect(sql).toMatch(
      /COALESCE\(\s*td\.argument ->> 'symbol',\s*td\.argument -> 'transaction' -> 'argument' ->> 'symbol'\s*\)/i,
    );

    // Same for amount inside the daily aggregation.
    expect(sql).toMatch(
      /COALESCE\(\s*td\.argument ->> 'amount',\s*td\.argument -> 'transaction' -> 'argument' ->> 'amount'\s*\)/i,
    );
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
