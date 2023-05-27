export function abbr(hash: string) {
  return hash.slice(0, 4) + "..." + hash.slice(-4);
}

export function ago(date: Date) {
  const secAgo = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  const intervals = [
    { name: "years", sec: 31_536_000 },
    { name: "months", sec: 2_592_000 },
    { name: "weeks", sec: 604_800 },
    { name: "days", sec: 86_400 },
    { name: "hours", sec: 3_600 },
    { name: "minutes", sec: 60 },
    { name: "seconds", sec: 10 },
  ];

  for (const i of intervals) {
    const qty = Math.floor(secAgo / i.sec);
    if (qty > 1) {
      return `${qty} ${i.name} ago`;
    }
  }
  return "just now";
}

export function by<T>(attr: keyof T) {
  return function (a: T, b: T) {
    return a[attr] < b[attr] ? 1 : -1;
  };
}

export function get(path: string, params = {}) {
  return async function () {
    const query = new URLSearchParams(params).toString();
    const url = `${import.meta.env.VITE_API_PATH}/${path}?${query}`;
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
    throw new Error(`${res.statusText} (${res.status})`);
  };
}


export function convertMemToGb(b: number): number {
  let gbValue = (b / (1000));
  return gbValue
}

export function convertMemToTb(b: number): number {
  let gbValue = (b / (1000 * 1000));
  return gbValue
}