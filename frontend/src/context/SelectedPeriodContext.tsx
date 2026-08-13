import { createContext, useContext, useState, ReactNode } from "react";

export interface SelectedPeriodContextType {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
}

const SelectedPeriodContext = createContext<SelectedPeriodContextType | undefined>(undefined);

interface SelectedPeriodProviderProps {
  children: ReactNode;
}

export function SelectedPeriodProvider({ children }: SelectedPeriodProviderProps) {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);

  const value: SelectedPeriodContextType = {
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
  };

  return (
    <SelectedPeriodContext.Provider value={value}>
      {children}
    </SelectedPeriodContext.Provider>
  );
}

export function useSelectedPeriod(): SelectedPeriodContextType {
  const context = useContext(SelectedPeriodContext);
  if (!context) {
    throw new Error("useSelectedPeriod must be used within a SelectedPeriodProvider");
  }
  return context;
}

export default SelectedPeriodContext;
