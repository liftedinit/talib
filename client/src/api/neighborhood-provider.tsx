import { createContext, ReactNode, useState } from "react";

const ID = import.meta.env.PROD ? 3 : 1; // Default to Manifest Ledger in production

export const NeighborhoodContext = createContext({
  id: ID,
  setId: (_: number) => {},
});

export function NeighborhoodProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState(ID);

  return (
    <NeighborhoodContext.Provider value={{ id, setId }}>
      {children}
    </NeighborhoodContext.Provider>
  );
}
