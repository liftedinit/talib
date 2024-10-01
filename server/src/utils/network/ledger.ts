import { Address, Message, NetworkModule,  } from "@liftedinit/many-js";

export interface Symbol {
  name: string; 
  symbol: string; 
  decimals: number;
}

export interface Token {
  address: ArrayBuffer;
  symbolInfo: Symbol;
}

export interface LedgerInfo {
  symbols: Token[];
}

export interface Balances {
  balances: Map<string, bigint>;
}

export interface Supply {
  total: string;
  circulating: string;
  maximum: string;
}

export interface Ledger extends NetworkModule {
  info(): Promise<LedgerInfo>;
  balance: (address?: string, symbols?: string[]) => Promise<Balances>;
  supply: (address: string) => Promise<Supply>;
}

export const Ledger: Ledger = {
  _namespace_: "ledger",

  async info() {
    const param = new Map();
    const msg = await this.call("ledger.info", param)

    return parseLedgerInfo(msg)
  },
  async balance(address?: string, symbols?: string[]): Promise<Balances> {
    const m = new Map<number, unknown>([[1, symbols ?? []]])
    address && m.set(0, address)
    const res = await this.call("ledger.balance", m)
    return parseBalance(res)
  },

  async supply(address: string): Promise<Supply> {
    const m = new Map<number, unknown>([[0, Address.fromString(address)]])
    const res = await this.call("tokens.info", m)

    return parseTokenInfoSupply(res)
  }
}

export function parseSymbol(symbol: any) {

  return {
    name: symbol.get(0)?.toString(),
    symbol: symbol.get(1)?.toString(),
    decimals: symbol.get(2)
  }
}


export function parseSupply(token: any) {

  return {
    total: token.get(0)?.toString(),
    circulating: token.get(1)?.toString(),
    maximum: token.get(2)?.toString()
  }
}

function parseLedgerInfo(msg: Message): any {
  const result: any = { symbols: new Array() }
  const decodedContent = msg.getPayload()

  if (decodedContent) {
    if (decodedContent.has(5)) {
      const symbols = decodedContent.get(5)

      for (const [address, info] of symbols.entries()) {
        const symbolInfo = parseSymbol(info);
        result.symbols.push({ address: address.toString(), symbolInfo });
      }

    }
  }
  return result
}

export function parseBalance(message: Message): Balances {
  const result = { balances: new Map() }
  const messageContent = message.getPayload()
  if (messageContent && messageContent.has(0)) {
    const symbolsToBalancesMap = messageContent.get(0)
    if (!(symbolsToBalancesMap instanceof Map)) return result
    for (const balanceEntry of symbolsToBalancesMap) {
      const symbolAddress = balanceEntry[0].toString()
      const balance = balanceEntry[1]
      result.balances.set(symbolAddress, balance)
    }
  }
  return result
}

function parseTokenInfoSupply(message: Message): Supply {
  const result: any = {};
  const decodedContent = message.getPayload();

  if (decodedContent) {
    // Log the address and its type
    const tokenMap = decodedContent.get(0);
    if (tokenMap instanceof Map) {

      const tokenInfo = tokenMap.get(1);
      if (tokenInfo instanceof Map) {
        result.info = parseSymbol(tokenInfo);
      }
  
      const tokenSupply = tokenMap.get(2);
      if (tokenSupply instanceof Map) {
        result.supply = parseSupply(tokenSupply);
      }

    }
  }

  return result;
}
