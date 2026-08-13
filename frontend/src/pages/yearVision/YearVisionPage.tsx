import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Skeleton,
  Alert,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";
import yearService from "../../services/yearService";
import categoryService from "../../services/categoryService";
import mockDatabase from "../../services/mockData";
import YearSummaryCards from "./components/YearSummaryCards";
import IncomeExpenseChart from "./components/IncomeExpenseChart";
import ExpenseBreakdownModal from "../../components/ExpenseBreakdownModal";
import { useSelectedPeriod } from "../../context/SelectedPeriodContext";
import formatCurrency from "../../utils/currencyFormatter";
import { YearSummaryResponse, CategoryResponse, TransactionResponse } from "../../types";

export function YearVisionPage() {
  const { selectedYear } = useSelectedPeriod();
  const [yearData, setYearData] = useState<YearSummaryResponse | null>(null);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [yearExpenses, setYearExpenses] = useState<TransactionResponse[]>([]);
  const [breakdownModalOpen, setBreakdownModalOpen] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    Promise.all([
      yearService.getYearSummary(selectedYear),
      categoryService.getCategories(),
    ])
      .then(([data, categoriesData]) => {
        if (isMounted) {
          setYearData(data);
          setCategories(categoriesData);

          // Get all year expense transactions from database/mock
          const allTxs = mockDatabase.getTransactions();
          const filtered = allTxs.filter(
            (tx) => Number(tx.year) === Number(selectedYear) && tx.type === "EXPENSE"
          );
          setYearExpenses(filtered);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to load year summary data:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  if (isLoading && !yearData) {
    return (
      <Box sx={{ p: 1 }}>
        <Skeleton variant="text" width={250} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Falha ao carregar os dados da visão anual. Por favor, tente novamente.
      </Alert>
    );
  }

  const { monthlyData = [], couple } = yearData || {};

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          {selectedYear} — Visão Anual
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Resumo financeiro anual, detalhamento por membro e tendências mensais
        </Typography>
      </Box>

      {/* Summary Cards */}
      <YearSummaryCards
        yearData={yearData}
        onOpenExpenseBreakdown={() => setBreakdownModalOpen(true)}
      />

      {/* Chart */}
      <IncomeExpenseChart monthlyData={monthlyData} />

      {/* Month-by-month Summary Table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#FFFFFF", border: "1px solid #E0E0E0" }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
          Detalhamento Mês a Mês ({selectedYear})
        </Typography>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Mês</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Receitas
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Despesas
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Reservas Registradas
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Saldo Líquido
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Resultado
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monthlyData.map((row) => (
              <TableRow
                key={row.month}
                sx={{
                  "&:hover": { backgroundColor: "#F9F9F9" },
                }}
              >
                <TableCell sx={{ fontWeight: 600 }}>{row.monthName}</TableCell>
                <TableCell align="right" sx={{ color: "success.main", fontWeight: 500 }}>
                  {formatCurrency(row.income)}
                </TableCell>
                <TableCell align="right" sx={{ color: "error.main", fontWeight: 500 }}>
                  {formatCurrency(row.expenses)}
                </TableCell>
                <TableCell align="right" sx={{ color: "primary.main", fontWeight: 500 }}>
                  {formatCurrency(row.savings)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    color: row.balance >= 0 ? "success.main" : "error.main",
                  }}
                >
                  {formatCurrency(row.balance)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={row.isPositive ? "Positivo" : "Negativo"}
                    size="small"
                    sx={{
                      backgroundColor: row.isPositive ? "#D9EAD3" : "#FFCDD2",
                      color: row.isPositive ? "#2E7D32" : "#B71C1C",
                      fontWeight: 600,
                      borderRadius: 1.5,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Expense Breakdown Modal for Year */}
      <ExpenseBreakdownModal
        open={breakdownModalOpen}
        onClose={() => setBreakdownModalOpen(false)}
        periodLabel={`Ano ${selectedYear}`}
        totalExpenses={couple?.totalExpenses || 0}
        expenses={yearExpenses}
        categories={categories}
      />
    </Box>
  );
}

export default YearVisionPage;
