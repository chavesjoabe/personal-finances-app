import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { MONTH_NAMES } from "../utils/dateFormatter";

interface MonthSelectorProps {
  value: number;
  onChange: (month: number) => void;
  label?: string;
}

export function MonthSelector({ value, onChange, label = "Mês" }: MonthSelectorProps) {
  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    onChange(Number(event.target.value));
  };

  return (
    <FormControl size="small" sx={{ minWidth: 150 }}>
      <InputLabel id="month-selector-label">{label}</InputLabel>
      <Select
        labelId="month-selector-label"
        id="month-selector"
        value={value}
        label={label}
        onChange={handleMonthChange}
        sx={{ borderRadius: 2, bgcolor: "#FFFFFF" }}
      >
        {MONTH_NAMES.map((name, index) => {
          const monthNumber = index + 1;
          return (
            <MenuItem key={monthNumber} value={monthNumber}>
              {name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default MonthSelector;
