import { createContext, ReactNode, useState, useEffect } from "react";
import { useQuery  } from "@tanstack/react-query";
import { getNeighborhoodTokens } from "./queries";
import localforage from "localforage";

const ID = import.meta.env.PROD ? 6 : 1; // Default to Manifest Ledger Alpha 2 (current) in production

export const NeighborhoodContext = createContext({
  id: ID,
  setId: (_: number) => {},
  tokens: [],
});

export function NeighborhoodProvider({ children }: { children: ReactNode }) {
  const [id, setIdState] = useState(ID);

  const setId = (newId: number) => {
    setIdState(newId);
    localforage.setItem("neighborhoodId", newId); // Store the id in localforage
  };

  // Retrieve the id from localforage during component mount
  useEffect(() => {
    localforage.getItem("neighborhoodId").then((storedId) => {
      if (typeof storedId === 'number') {
        setIdState(storedId);
      }
    });
  }, []);

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
