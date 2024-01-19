import React, { createContext, useContext,  ReactNode, useState } from "react";

const TopNavContext = createContext(
  {
    activeIndex: null,
    handleItemClick: (index: any) => {}
  }
);

export const TopNavProvider = ({ children }: { children: ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleItemClick = (index: any) => {
    setActiveIndex(index);
  };

  return (
    <TopNavContext.Provider value={{ activeIndex, handleItemClick }}>
      {children}
    </TopNavContext.Provider>
  );
};

export const useTopNav = () => {
  const context = useContext(TopNavContext);
  if (!context) {
    throw new Error("useTopNav must be used within a TopNavProvider");
  }
  return context;
};
