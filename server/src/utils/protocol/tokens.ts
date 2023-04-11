import { Address } from "@liftedinit/many-js";
import { parseAddress } from "../cbor-parsers";

export interface TokenInfoSummaryDto {
  name: string;
  ticker: string;
  precision: number;
}

export function parseTokenInfoSummary(
  map: Map<number, any>,
): TokenInfoSummaryDto {
  return {
    name: map.get(0).toString(),
    ticker: map.get(1).toString(),
    precision: +map.get(2),
  };
}

export type TokenHolderMapDto = { [address: string]: string };

export function parseTokenHolderMap(
  map: Map<Address, any> | { [a: string]: any },
): TokenHolderMapDto {
  const roles = {};

  if (map instanceof Map) {
    map = Object.fromEntries(map);
  }

  for (const [key, value] of Object.entries(map)) {
    roles[key.toString()] = value.toString();
  }

  return roles;
}

export interface TokenInfoSupplyDto {
  total: string;
  circulating: string;
  maximum?: string;
}

export function parseTokenSupply(payload: Map<any, any>): TokenInfoSupplyDto {
  return {
    total: payload.get(0).toString(),
    circulating: payload.get(1).toString(),
    ...(payload.has(2) && { maximum: payload.get(2).toString() }),
  };
}

export interface TokenInfoDto {
  symbol: string;
  summary: TokenInfoSummaryDto;
  supply: TokenInfoSupplyDto;
  owner?: string;
}

export function parseTokenInfo(payload: Map<any, any>): TokenInfoDto {
  let maybeOwner = parseAddress(payload.get(3), true);
  return {
    symbol: parseAddress(payload.get(0), false).toString(),
    summary: parseTokenInfoSummary(payload.get(1)),
    supply: parseTokenSupply(payload.get(2)),
    ...(maybeOwner && { owner: maybeOwner.toString() }),
  };
}
