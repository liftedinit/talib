import { useColorModeValue } from "@liftedinit/ui";

export function useBgColor() {
  return useColorModeValue('white', 'lifted.black.800');
}

export function useTextColor() {
  return useColorModeValue('black', 'white');
}

export function useButtonBg() {
  return useColorModeValue('lifted.gray.200', 'lifted.black.800');
}

export function abbr(hash: string) {
  return hash.slice(0, 4) + "..." + hash.slice(-4);
}

export function useMapBgColor() {
  return useColorModeValue('lifted.black.900', 'lifted.black.900');
}

export function useMapStrokeColor() {
  return useColorModeValue('#2c2c31', '#2c2c31');
}

export function useMarkerColor() {
  return useColorModeValue('#80DBCF','#80DBCF');
}

export function useMarkerStrokeColor() {
  return useColorModeValue('#80DBCF','#80DBCF');
}

export function useMapFillColor() {
  return useColorModeValue('lifted.gray.300','lifted.black.800');
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

export function convertBytesToMb(b: number): number {
  let gbValue = (b / (1000 * 1000));
  return gbValue
}

export function convertBytesToGb(b: number): number {
  let gbValue = (b / (1000 * 1000 * 1000));
  return gbValue
}

export function convertKbToGb(b: number): number {
  let gbValue = (b / (1000 * 1000));
  return gbValue
}

export function convertKbToTb(b: number): number {
  let gbValue = (b / (1000 * 1000 * 1000));
  return gbValue
}

export function convertGbToTb(b: number): number {
  let gbValue = (b / (1000));
  return gbValue
}

export function convertTbToPb(b: number): number {
  let gbValue = (b / (1000 * 1000 ));
  return gbValue
}

export function convertNumToBil(b: number): number {
  let bilValue = (b / 1000000000);
  return bilValue
}

export const STALE_INTERVAL = 60000;
export const REFRESH_INTERVAL = 10000;
