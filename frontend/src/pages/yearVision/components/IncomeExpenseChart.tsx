import { Paper, Typography, Box } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import formatCurrency from "../../../utils/currencyFormatter";
import { YearMonthlyDataResponse } from "../../../types";

interface IncomeExpenseChartProps {
  monthlyData?: YearMonthlyDataResponse[];
}

export function IncomeExpenseChart({ monthlyData = [] }: IncomeExpenseChartProps) {
  if (monthlyData.length === 0) return null;

  const chartData = monthlyData.map((item) => ({
    name: item.monthName.substring(0, 3),
    Receitas: item.income,
    Despesas: item.expenses,
    Saldo: item.balance,
  }));

  const customTooltipFormatter = (value: number, name: string) => {
    return [formatCurrency(value), name];
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#FFFFFF", border: "1px solid #E0E0E0", mb: 4 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
        Receitas vs Despesas por Mês
      </Typography>

      <Box sx={{ width: "100%", height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
            <XAxis dataKey="name" stroke="#757575" />
            <YAxis
              stroke="#757575"
              tickFormatter={(val: number) => `R$${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
            />
            <Tooltip formatter={customTooltipFormatter as unknown as undefined} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Bar dataKey="Receitas" fill="#2E7D32" radius={[4, 4, 0, 0]} name="Receitas" />
            <Bar dataKey="Despesas" fill="#ED7D31" radius={[4, 4, 0, 0]} name="Despesas" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default IncomeExpenseChart;
