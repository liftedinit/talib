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
