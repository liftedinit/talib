import { createContext, ReactNode, useState } from "react";

const DEFAULT_NEIGHBORHOOD_ID = 1;

export const NeighborhoodContext = createContext({
  id: DEFAULT_NEIGHBORHOOD_ID,
  setId: (_: number) => {},
});

export function NeighborhoodProvider({ children }: { children: ReactNode }) {
  const [neighborhoodId, setNeighborhoodId] = useState(DEFAULT_NEIGHBORHOOD_ID);

  return (
    <NeighborhoodContext.Provider
      value={{ id: neighborhoodId, setId: setNeighborhoodId }}
    >
      {children}
    </NeighborhoodContext.Provider>
  );
}
