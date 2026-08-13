import { Box } from "@mui/material";
import YearSelector from "./YearSelector";
import MonthSelector from "./MonthSelector";
import { useSelectedPeriod } from "../context/SelectedPeriodContext";

interface PeriodSelectorProps {
  showMonth?: boolean;
}

export function PeriodSelector({ showMonth = true }: PeriodSelectorProps) {
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } = useSelectedPeriod();

  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <YearSelector value={selectedYear} onChange={setSelectedYear} />
      {showMonth && <MonthSelector value={selectedMonth} onChange={setSelectedMonth} />}
    </Box>
  );
}

export default PeriodSelector;
