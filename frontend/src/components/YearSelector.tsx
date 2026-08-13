import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

interface YearSelectorProps {
  value: number;
  onChange: (year: number) => void;
  label?: string;
  availableYears?: number[];
}

export function YearSelector({
  value,
  onChange,
  label = "Ano",
  availableYears = [2024, 2025, 2026, 2027],
}: YearSelectorProps) {
  const handleYearChange = (event: SelectChangeEvent<number>) => {
    onChange(Number(event.target.value));
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="year-selector-label">{label}</InputLabel>
      <Select
        labelId="year-selector-label"
        id="year-selector"
        value={value}
        label={label}
        onChange={handleYearChange}
        sx={{ borderRadius: 2, bgcolor: "#FFFFFF" }}
      >
        {availableYears.map((yearItem) => (
          <MenuItem key={yearItem} value={yearItem}>
            {yearItem}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default YearSelector;
