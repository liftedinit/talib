// @TODO: Move this to .env or something
const API_BASE_URL = "/api/v1/";

function get(...path: (string | number)[]) {
  return async function () {
    const res = await fetch(API_BASE_URL + path.join("/"));
    if (res.ok) {
      return await res.json();
    }
    throw new Error(`${res.statusText} (${res.status})`);
  };
}

export function getNeighborhood(id: number) {
  return get("neighborhoods", id);
}

export function getNeighborhoodBlocks(id: number) {
  return get("neighborhoods", id, "blocks");
}

export function getNeighborhoodTransactions(id: number) {
  return get("neighborhoods", id, "transactions");
}
