import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SortContextType {
  sort: string;
  setSort: (sort: string) => void;
}

const SortContext = createContext<SortContextType | undefined>(undefined);

export const SortProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sort, setSort] = useState<string>('like');

  return (
    <SortContext.Provider value={{ sort, setSort }}>
      {children}
    </SortContext.Provider>
  );
};

export const useReviewSortContext = (): SortContextType => {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error('useSort must be used within a SortProvider');
  }
  return context;
};
