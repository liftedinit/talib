import { NeighborhoodContext } from "api";
import { useContext } from "react";

interface token  {
  name: string
  symbol: string,
  address: string,
  precision: number
}

export const MFX_TOKEN = {
    name: "Manifest Network Token",
    symbol: "MFX",
    address: "mqbh742x4s356ddaryrxaowt4wxtlocekzpufodvowrirfrqaaaaa3l",
    precision: 9,
};

const UNKNOWN_TOKEN = {
  name: "Unknown Token",
  symbol: "Unknown Token",
  address: "",
  precision: 1,
};

export function useFindToken(address: string) {
  const context = useContext(NeighborhoodContext)

  let KNOWN_TOKENS: token[] = context.tokens

  console.log(`context.tokens: ${JSON.stringify(context.tokens)}`);

  // Check if there are tokens otherwise configure default to MFX 
  if (KNOWN_TOKENS === undefined || KNOWN_TOKENS.length === 0) {
    KNOWN_TOKENS = [MFX_TOKEN];
  } else {
    KNOWN_TOKENS = context.tokens;
  }

  return KNOWN_TOKENS?.find((t) => t.address === address) ?? UNKNOWN_TOKEN;
}
