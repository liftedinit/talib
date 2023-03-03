function get(...path: (string | number)[]) {
  return async function () {
    const res = await fetch(process.env.REACT_APP_API_PATH + path.join("/"));
    if (res.ok) {
      return await res.json();
    }
    throw new Error(`${res.statusText} (${res.status})`);
  };
}

export function getNeighborhoods() {
  return get("neighborhoods");
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
