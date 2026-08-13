import { useEffect, useState } from "react";
import { Box, Typography, Skeleton, Alert, Card, CardContent } from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";
import yearService from "../../services/yearService";
import SavingsTable from "./components/SavingsTable";
import SavingsAccumulatedChart from "./components/SavingsAccumulatedChart";
import { useSelectedPeriod } from "../../context/SelectedPeriodContext";
import formatCurrency from "../../utils/currencyFormatter";
import { YearSavingsResponse } from "../../types";

export function SavingsPage() {
  const { selectedYear } = useSelectedPeriod();
  const [savingsData, setSavingsData] = useState<YearSavingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    yearService
      .getYearSavings(selectedYear)
      .then((data) => {
        if (isMounted) {
          setSavingsData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Failed to load savings data:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  if (isLoading && !savingsData) {
    return (
      <Box sx={{ p: 1 }}>
        <Skeleton variant="text" width={250} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="rectangular" height={350} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Falha ao carregar os dados de reservas. Por favor, tente novamente.
      </Alert>
    );
  }

  const { members = [], totalSavingsYear = 0, monthlySavings = [] } = savingsData || {};

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          {selectedYear} — Reservas e Investimentos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Acompanhe as contribuições de reservas individuais e o total acumulado
        </Typography>
      </Box>

      {/* Top Banner Card */}
      <Card elevation={0} sx={{ mb: 4, bgcolor: "#FFFFFF", border: "1px solid #BBDEFB" }}>
        <CardContent sx={{ p: 3, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 3,
                bgcolor: "#E3F2FD",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SavingsIcon sx={{ fontSize: 36, color: "primary.main" }} />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Total Guardado em {selectedYear}
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {formatCurrency(totalSavingsYear)}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Accumulated Growth Chart */}
      <SavingsAccumulatedChart monthlySavings={monthlySavings} />

      {/* Month-by-month Table */}
      <SavingsTable members={members} monthlySavings={monthlySavings} />
    </Box>
  );
}

export default SavingsPage;
