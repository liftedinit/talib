import { createContext, ReactNode, useState } from "react";

const ID = 1;

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
