import { Grid, Card, CardContent, Typography, Box, Chip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import formatCurrency from "../../../utils/currencyFormatter";
import { MonthVisionSummaryResponse } from "../../../types";

interface MonthSummaryCardsProps {
  summary?: MonthVisionSummaryResponse | null;
  onOpenExpenseBreakdown?: () => void;
}

export function MonthSummaryCards({ summary, onOpenExpenseBreakdown }: MonthSummaryCardsProps) {
  if (!summary) return null;

  const {
    totalIncome = 0,
    totalExpenses = 0,
    netBalance = 0,
    pendingCount = 0,
    pendingAmount = 0,
  } = summary;

  const cardsData = [
    {
      title: "Total de Receitas",
      value: formatCurrency(totalIncome),
      icon: <TrendingUpIcon sx={{ color: "success.main", fontSize: 28 }} />,
      bgColor: "#E8F5E9",
      borderColor: "#C8E6C9",
      clickable: false,
    },
    {
      title: "Total de Despesas",
      value: formatCurrency(totalExpenses),
      icon: <TrendingDownIcon sx={{ color: "error.main", fontSize: 28 }} />,
      bgColor: "#FFEBEE",
      borderColor: "#FFCDD2",
      clickable: true,
      hint: "Clique para ver o detalhamento ➔",
    },
    {
      title: "Saldo Líquido do Mês",
      value: formatCurrency(netBalance),
      icon: <AccountBalanceIcon sx={{ color: "primary.main", fontSize: 28 }} />,
      bgColor: netBalance >= 0 ? "#E3F2FD" : "#FFF3E0",
      borderColor: netBalance >= 0 ? "#BBDEFB" : "#FFE0B2",
      badge: netBalance >= 0 ? "Positivo" : "Negativo",
      badgeColor: (netBalance >= 0 ? "success" : "error") as "success" | "error",
      clickable: false,
    },
    {
      title: "Contas a Pagar / Pendentes",
      value: formatCurrency(pendingAmount),
      subtitle: `${pendingCount} item(ns) pendente(s)`,
      icon: <PendingActionsIcon sx={{ color: "warning.dark", fontSize: 28 }} />,
      bgColor: "#FFF8E1",
      borderColor: "#FFE082",
      clickable: false,
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {cardsData.map((cardItem, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card
            elevation={0}
            onClick={cardItem.clickable ? onOpenExpenseBreakdown : undefined}
            sx={{
              backgroundColor: "#FFFFFF",
              border: `1px solid ${cardItem.borderColor}`,
              transition: "all 0.2s ease",
              cursor: cardItem.clickable ? "pointer" : "default",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: cardItem.clickable
                  ? "0px 6px 16px rgba(211, 47, 47, 0.15)"
                  : "0px 4px 12px rgba(0,0,0,0.06)",
                borderColor: cardItem.clickable ? "#D32F2F" : cardItem.borderColor,
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {cardItem.title}
                </Typography>
                <Box
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: cardItem.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cardItem.icon}
                </Box>
              </Box>

              <Typography variant="h5" fontWeight={700} color="text.primary">
                {cardItem.value}
              </Typography>

              {cardItem.subtitle && (
                <Typography variant="caption" color="warning.dark" fontWeight={600} sx={{ mt: 0.5, display: "block" }}>
                  {cardItem.subtitle}
                </Typography>
              )}

              {cardItem.badge && (
                <Chip
                  label={cardItem.badge}
                  size="small"
                  color={cardItem.badgeColor}
                  sx={{ mt: 1, fontWeight: 600, height: 20, fontSize: "0.7rem" }}
                />
              )}

              {cardItem.clickable && (
                <Typography
                  variant="caption"
                  color="error.main"
                  fontWeight={700}
                  sx={{ mt: 1, display: "block", fontSize: "0.72rem" }}
                >
                  {cardItem.hint}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default MonthSummaryCards;
