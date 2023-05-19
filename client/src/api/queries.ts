import { get } from "utils";

const PAGE = 1;
const LIMIT = 25;

export function getNeighborhoods() {
  return get("neighborhoods");
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

export function getManifestMetrics() {
  return get(`metrics`)
}

export function getManifestMetric(stat: string) {
  return get(`metrics/${stat}`)
}

export function getManifestMetricCurrent(stat: string) {
  return get(`metrics/${stat}/current`)
}

export function getManifestMetricSeries(stat: string) {
  return get(`metrics/${stat}/series`)
}
