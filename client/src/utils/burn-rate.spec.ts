import { describe, it, expect } from "vitest";
import {
  calculateRates,
  calculateAverageRate,
  type CumulativePoint,
  type RateUnit,
} from "./burn-rate";

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

describe("calculateAverageRate", () => {
  it("returns 0n for an empty series", () => {
    expect(calculateAverageRate([])).toBe(0n);
  });

  it("averages the rate values (floored to whole uMFX)", () => {
    const avg = calculateAverageRate([
      point("2026-01-02", "150"),
      point("2026-01-03", "150"),
      point("2026-01-04", "300"),
    ]);

    expect(avg).toBe(200n); // (150 + 150 + 300) / 3
  });
});
