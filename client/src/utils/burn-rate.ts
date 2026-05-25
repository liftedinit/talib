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

// The burned-MFX series is day-bucketed on the server (see
// MigrationsService.getBurnedMfxSeries), so finer-than-daily rate units would
// degenerate to the same value as `per_day`. Match the manifest-dashboard
// pattern of only offering rate units compatible with the data resolution.
export const RATE_UNIT_OPTIONS: RateUnit[] = [
  "per_day",
  "per_week",
  "per_month",
];

/**
 * Differencing over a sorted (ASC) cumulative series.
 * For each point i, find the latest point j < i with date <= date[i] - windowMs
 * and emit (value[i] - value[j]). If no such j exists (the window extends
 * before the first data point), that i is skipped. Two-pointer, O(n).
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
