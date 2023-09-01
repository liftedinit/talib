import { get } from "utils";

const PAGE = 1;
const LIMIT = 25;
const FROM = "now-60m";
const TO = "now";
const INTERVALMS = 30000;
const MAXDATAPOINTS = 3000;

export function getNeighborhoods(searchable: boolean = true) {
  return get(`neighborhoods/`, { searchable });
}

export function getNeighborhood(id: number) {
  return get(`neighborhoods/${id}`);
}

export function getNeighborhoodBlocks(
  id: number,
  { page = PAGE, limit = LIMIT } = {},
) {
  return get(`neighborhoods/${id}/blocks`, { page, limit });
}

export function getNeighborhoodTransactions(
  id: number,
  { page = PAGE, limit = LIMIT } = {},
) {
  return get(`neighborhoods/${id}/transactions`, { page, limit });
}

export function getNeighborhoodBlock(id: number, hash: string) {
  return get(`neighborhoods/${id}/blocks/${hash}`);
}

export function getNeighborhoodTransaction(id: number, hash: string) {
  return get(`neighborhoods/${id}/transactions/${hash}`);
}

export function getNeighborhoodAddress(id: number, address: string) {
  return get(`neighborhoods/${id}/addresses/${address}`);
}

export function getMetrics() {
  return get(`prometheusquery`)
}

export function getMetric(stat: string) {
  return get(`prometheusquery/${stat}`)
}

export function getMetricCurrent(
    stat?: string, 
    {from = FROM, to = TO } = {}
  ) {
    return get(`metrics/${stat}/current`, { from, to});
}

export function getMetricSeries(
  stat?: string, 
  {from = FROM, to = TO } = {}
) {
    return get(`metrics/${stat}/series`, { from, to });
}

export function getMetricTransformCurrent(
  stat?: string, 
  transform?: string,
  {from = FROM, to = TO } = {}
) {
  return get(`metrics/transforms/${stat}/${transform}/current`, { from, to });
}

export function getMetricTransformSeries(
  stat?: string, 
  transform?: string,
  {from = FROM, to = TO} = {}
) {
    return get(`metrics/transforms/${stat}/${transform}/series`, { from, to });
}

export function getMetricSystemWideCurrent(
  metric?: string,
) {
  return get(`metrics/systemwide/${metric}/current`);
}

export function getMetricSystemWideSeries(
  metric?: string,
  {from = FROM, to = TO } = {}
) {
    return get(`metrics/systemwide/${metric}/series`, { from, to });
}
