import { Grid, Card, CardContent, Typography, Box, Divider } from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import formatCurrency from "../../../utils/currencyFormatter";
import { YearSummaryResponse, YearMemberSummaryResponse } from "../../../types";

interface YearSummaryCardsProps {
  yearData?: YearSummaryResponse | null;
  onOpenExpenseBreakdown?: () => void;
}

export function YearSummaryCards({ yearData, onOpenExpenseBreakdown }: YearSummaryCardsProps) {
  if (!yearData) return null;

  const { couple = { grossIncome: 0, totalExpenses: 0, netBalance: 0 }, members = [] } = yearData;
  const { grossIncome = 0, totalExpenses = 0, netBalance = 0 } = couple;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Visão Geral Anual
      </Typography>

      <Grid container spacing={3}>
        {/* Couple Total Gross Income */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={0} sx={{ bgcolor: "#FFFFFF", border: "1px solid #C8E6C9" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Receita Bruta do Casal
                </Typography>
                <TrendingUpIcon sx={{ color: "success.main" }} />
              </Box>
              <Typography variant="h5" fontWeight={700} color="success.main" gutterBottom>
                {formatCurrency(grossIncome)}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <StackDirection members={members} field="grossIncome" />
            </CardContent>
          </Card>
        </Grid>

        {/* Couple Total Expenses (Clickable) */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            elevation={0}
            onClick={onOpenExpenseBreakdown}
            sx={{
              bgcolor: "#FFFFFF",
              border: "1px solid #FFCDD2",
              cursor: "pointer",
              transition: "all 0.2s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0px 6px 16px rgba(211, 47, 47, 0.15)",
                borderColor: "#D32F2F",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Despesas Totais do Casal
                </Typography>
                <TrendingDownIcon sx={{ color: "error.main" }} />
              </Box>
              <Typography variant="h5" fontWeight={700} color="error.main" gutterBottom>
                {formatCurrency(totalExpenses)}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <StackDirection members={members} field="totalExpenses" />
              <Typography
                variant="caption"
                color="error.main"
                fontWeight={700}
                sx={{ mt: 1.5, display: "block", textAlign: "right", fontSize: "0.72rem" }}
              >
                Clique para ver o detalhamento ➔
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Couple Net Balance */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={0} sx={{ bgcolor: "#FFFFFF", border: `1px solid ${netBalance >= 0 ? "#BBDEFB" : "#FFE0B2"}` }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Saldo Líquido do Casal
                </Typography>
                <AccountBalanceWalletIcon sx={{ color: "primary.main" }} />
              </Box>
              <Typography variant="h5" fontWeight={700} color={netBalance >= 0 ? "primary.main" : "warning.dark"} gutterBottom>
                {formatCurrency(netBalance)}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <StackDirection members={members} field="netBalance" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

interface StackDirectionProps {
  members: YearMemberSummaryResponse[];
  field: "grossIncome" | "totalExpenses" | "netBalance" | "totalSavings";
}

function StackDirection({ members, field }: StackDirectionProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {members.map((member) => (
        <Box key={member.memberId} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: member.memberColor || "#1976D2",
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {member.memberName}
            </Typography>
          </Box>
          <Typography variant="caption" fontWeight={600}>
            {formatCurrency(member[field] || 0)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default YearSummaryCards;
