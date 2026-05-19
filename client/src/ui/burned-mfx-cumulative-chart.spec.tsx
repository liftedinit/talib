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
