import { get } from "utils";

const PAGE = 1;
const LIMIT = 25;
const FROM = "now-60m";
const TO = "now";
const INTERVALMS = 30000;
const MAXDATAPOINTS = 3000;

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

export function getNeighborhoodAddress(
  id: number, 
  address: string,
  { page = PAGE, limit = LIMIT } = {}
) {
  return get(`neighborhoods/${id}/addresses/${address}`, { page, limit });
}

export function getNeighborhoodMigrations(
  id: number,
  { page = PAGE, limit = LIMIT} = {},
) {
  return get(`neighborhoods/${id}/migrations`, { page, limit })
}

export function getNeighborhoodMigration(id: number, uuid: string) {
  return get(`neighborhoods/${id}/migrations/${uuid}`);
}

export function getNeighborhoodTokens(
  id: number,
  { page = PAGE, limit = LIMIT} = {},
) {
  return get(`neighborhoods/${id}/tokens`, { page, limit })
}

export function getNeighborhoodToken(id: number, address: string) {
  return get(`neighborhoods/${id}/tokens/${address}`);
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
  smoothed?: boolean,
  windowsize?: number,
  {from = FROM, to = TO } = {},
) {
    return get(`metrics/${stat}/series`, { from, to, smoothed, windowsize });
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

export function getLocations() {
  return get("location");
}
