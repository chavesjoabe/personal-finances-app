import { Paper, Typography, Box } from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import formatCurrency from "../../../utils/currencyFormatter";
import { MonthlySavingsResponse } from "../../../types";

interface SavingsAccumulatedChartProps {
  monthlySavings?: MonthlySavingsResponse[];
}

export function SavingsAccumulatedChart({ monthlySavings = [] }: SavingsAccumulatedChartProps) {
  if (monthlySavings.length === 0) return null;

  const chartData = monthlySavings.map((item) => ({
    name: item.monthName.substring(0, 3),
    "Depósito Mensal": item.monthTotal,
    "Reserva Acumulada": item.accumulatedTotal,
  }));

  const customTooltipFormatter = (value: number, name: string) => {
    return [formatCurrency(value), name];
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#FFFFFF", border: "1px solid #E0E0E0", mb: 4 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
        Crescimento da Reserva Acumulada ao Longo do Tempo
      </Typography>

      <Box sx={{ width: "100%", height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
            <XAxis dataKey="name" stroke="#757575" />
            <YAxis
              stroke="#757575"
              tickFormatter={(val: number) => `R$${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
            />
            <Tooltip formatter={customTooltipFormatter as unknown as undefined} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Line
              type="monotone"
              dataKey="Reserva Acumulada"
              stroke="#1976D2"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
              name="Reserva Acumulada"
            />
            <Line
              type="monotone"
              dataKey="Depósito Mensal"
              stroke="#FFB74D"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 4 }}
              name="Depósito Mensal"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default SavingsAccumulatedChart;
