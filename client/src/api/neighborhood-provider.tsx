import { createContext, ReactNode, useState } from "react";
import { useQuery  } from "@tanstack/react-query";
import { getNeighborhoodTokens } from "./queries";

const ID = import.meta.env.PROD ? 6 : 1; // Default to Manifest Ledger Alpha 2 (current) in production

export const NeighborhoodContext = createContext({
  id: ID,
  setId: (_: number) => {},
  tokens: [],
});

export function NeighborhoodProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState(ID);

  const tokensQuery = useQuery(
    ["neighborhoods", id, "tokens"],
    getNeighborhoodTokens(id),
  );

  const { data, isError, isSuccess} = tokensQuery;
  const tokens = isError || !data ? [] : data.items;

  return (
    <NeighborhoodContext.Provider value={{ id, setId, tokens }}>
      {children}
    </NeighborhoodContext.Provider>
  );
}
