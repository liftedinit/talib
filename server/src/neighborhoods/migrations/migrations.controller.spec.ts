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
