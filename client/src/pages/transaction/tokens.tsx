// @TODO: Populate this from tokens.info
export const KNOWN_TOKENS = [
  {
    address: "mqbh742x4s356ddaryrxaowt4wxtlocekzpufodvowrirfrqaaaaa3l",
    ticker: "MFX",
    precision: 9,
  },
];

const UNKNOWN_TOKEN = {
  address: "",
  ticker: "Unknown Token",
  precision: 1,
};

export function findToken(address: string) {
  return KNOWN_TOKENS.find((t) => t.address === address) ?? UNKNOWN_TOKEN;
}
