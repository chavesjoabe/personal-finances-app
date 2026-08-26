import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SavingsIcon from "@mui/icons-material/Savings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TransactionTable from "./TransactionTable";
import formatCurrency from "../../../utils/currencyFormatter";
import {
  PeriodSummaryResponse,
  MemberResponse,
  CategoryResponse,
  TransactionResponse,
  TransactionType,
  TransactionStatus,
  Period,
} from "../../../types";

interface PeriodSectionProps {
  title: string;
  periodKey: Period;
  periodData?: PeriodSummaryResponse | null;
  members?: MemberResponse[];
  categories?: CategoryResponse[];
  onToggleStatus?: (transactionId: string, currentStatus: TransactionStatus) => void;
  onOpenCreateModal: (type: TransactionType, period: Period, memberId: string) => void;
  onEditTransaction: (transaction: TransactionResponse) => void;
  onDeleteTransaction: (transaction: TransactionResponse) => void;
  defaultExpanded?: boolean;
}

export function PeriodSection({
  title,
  periodKey,
  periodData,
  members = [],
  categories = [],
  onToggleStatus,
  onOpenCreateModal,
  onEditTransaction,
  onDeleteTransaction,
  defaultExpanded = true,
}: PeriodSectionProps) {
  if (!periodData) return null;

  const {
    incomes = [],
    expenses = [],
    savings = [],
    totalIncome = 0,
    totalExpense = 0,
    totalSavings = 0,
  } = periodData;

  const periodBalance =
    periodData.balance !== undefined ? periodData.balance : totalIncome - totalExpense;
  const periodBalanceMinusSavings =
    periodData.balanceMinusSavings !== undefined
      ? periodData.balanceMinusSavings
      : periodBalance - totalSavings;

  const isCoupleMode = members.length > 1;

  const knownMemberIds = new Set(members.map((m) => m._id));
  const unassignedIncomes = incomes.filter((tx) => !knownMemberIds.has(tx.memberId));
  const unassignedExpenses = expenses.filter((tx) => !knownMemberIds.has(tx.memberId));
  const unassignedSavings = savings.filter((tx) => !knownMemberIds.has(tx.memberId));
  const hasUnassigned =
    unassignedIncomes.length > 0 || unassignedExpenses.length > 0 || unassignedSavings.length > 0;

  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      elevation={0}
      sx={{
        mb: 3,
        borderRadius: "12px !important",
        border: "1px solid #E0E0E0",
        backgroundColor: "#FFFFFF",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{
          backgroundColor: "#FAFAFA",
          borderRadius: "12px 12px 0 0",
          px: 3,
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", pr: 2, flexWrap: "wrap", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <CalendarTodayIcon color="primary" fontSize="small" />
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="body2" color="text.secondary">
              Receitas: <strong style={{ color: "#2E7D32" }}>{formatCurrency(totalIncome)}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Despesas: <strong style={{ color: "#D32F2F" }}>{formatCurrency(totalExpense)}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reservas: <strong style={{ color: "#1976D2" }}>{formatCurrency(totalSavings)}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saldo: <strong style={{ color: periodBalance >= 0 ? "#2E7D32" : "#D32F2F" }}>{formatCurrency(periodBalance)}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saldo - Reservas: <strong style={{ color: periodBalanceMinusSavings >= 0 ? "#1565C0" : "#D32F2F" }}>{formatCurrency(periodBalanceMinusSavings)}</strong>
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 3 }}>
        {/* Single Mode (full width) or Couple Mode (side-by-side columns) */}
        <Grid container spacing={3}>
          {members.map((member) => {
            const memberIncomes = incomes.filter((tx) => tx.memberId === member._id);
            const memberExpenses = expenses.filter((tx) => tx.memberId === member._id);
            const memberSavings = savings.filter((tx) => tx.memberId === member._id);

            const memberIncSum = memberIncomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
            const memberExpSum = memberExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
            const memberSavSum = memberSavings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
            const memberBalance = memberIncSum - memberExpSum;
            const memberBalanceMinusSavings = memberBalance - memberSavSum;

            return (
              <Grid item xs={12} md={isCoupleMode ? 6 : 12} key={member._id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    border: `2px solid ${member.color || "#1976D2"}44`,
                    bgcolor: "#FFFFFF",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Member Card Header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      pb: 1.5,
                      mb: 2,
                      borderBottom: `2px solid ${member.color || "#1976D2"}22`,
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          backgroundColor: member.color || "#1976D2",
                        }}
                      />
                      <Typography variant="h6" fontWeight={700} style={{ color: member.color || "#1976D2" }}>
                        {member.name}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                      <Chip
                        label={`Saldo: ${formatCurrency(memberBalance)}`}
                        size="small"
                        sx={{
                          backgroundColor: memberBalance >= 0 ? "#E8F5E9" : "#FFEBEE",
                          color: memberBalance >= 0 ? "#2E7D32" : "#C62828",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                        }}
                      />
                      <Chip
                        label={`Saldo - Reservas: ${formatCurrency(memberBalanceMinusSavings)}`}
                        size="small"
                        sx={{
                          backgroundColor: memberBalanceMinusSavings >= 0 ? "#E3F2FD" : "#FFF3E0",
                          color: memberBalanceMinusSavings >= 0 ? "#1565C0" : "#C62828",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                        }}
                      />
                    </Box>
                  </Box>

                  {/* Member Section Totals Mini Bar */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                      mb: 2.5,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#F8F9FA",
                      fontSize: "0.85rem",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Rec: <strong style={{ color: "#2E7D32" }}>{formatCurrency(memberIncSum)}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Desp: <strong style={{ color: "#D32F2F" }}>{formatCurrency(memberExpSum)}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Reserva: <strong style={{ color: "#1976D2" }}>{formatCurrency(memberSavSum)}</strong>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Saldo - Reservas: <strong style={{ color: memberBalanceMinusSavings >= 0 ? "#1565C0" : "#D32F2F" }}>{formatCurrency(memberBalanceMinusSavings)}</strong>
                    </Typography>
                  </Box>

                  {/* Member Incomes */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <TrendingUpIcon fontSize="small" sx={{ color: "success.main" }} />
                        <Typography variant="subtitle2" fontWeight={600} color="success.main">
                          Receitas
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => onOpenCreateModal("INCOME", periodKey, member._id)}
                        sx={{ fontSize: "0.75rem", py: 0.2 }}
                      >
                        + Receita
                      </Button>
                    </Box>
                    <TransactionTable
                      transactions={memberIncomes}
                      members={members}
                      categories={categories}
                      onToggleStatus={onToggleStatus}
                      onEditTransaction={onEditTransaction}
                      onDeleteTransaction={onDeleteTransaction}
                      type="INCOME"
                      showMemberColumn={false}
                    />
                  </Box>

                  {/* Member Expenses */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <TrendingDownIcon fontSize="small" sx={{ color: "error.main" }} />
                        <Typography variant="subtitle2" fontWeight={600} color="error.main">
                          Despesas
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => onOpenCreateModal("EXPENSE", periodKey, member._id)}
                        sx={{ fontSize: "0.75rem", py: 0.2 }}
                      >
                        + Despesa
                      </Button>
                    </Box>
                    <TransactionTable
                      transactions={memberExpenses}
                      members={members}
                      categories={categories}
                      onToggleStatus={onToggleStatus}
                      onEditTransaction={onEditTransaction}
                      onDeleteTransaction={onDeleteTransaction}
                      type="EXPENSE"
                      showMemberColumn={false}
                    />
                  </Box>

                  {/* Member Savings */}
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <SavingsIcon fontSize="small" sx={{ color: "primary.main" }} />
                        <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                          Reservas
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => onOpenCreateModal("SAVINGS", periodKey, member._id)}
                        sx={{ fontSize: "0.75rem", py: 0.2 }}
                      >
                        + Reserva
                      </Button>
                    </Box>
                    <TransactionTable
                      transactions={memberSavings}
                      members={members}
                      categories={categories}
                      onToggleStatus={onToggleStatus}
                      onEditTransaction={onEditTransaction}
                      onDeleteTransaction={onDeleteTransaction}
                      type="SAVINGS"
                      showMemberColumn={false}
                    />
                  </Box>
                </Paper>
              </Grid>
            );
          })}

          {/* Unassigned Entries fallback */}
          {hasUnassigned && (
            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px dashed #FF9800", bgcolor: "#FFF8E1" }}>
                <Typography variant="subtitle2" fontWeight={600} color="warning.dark" gutterBottom>
                  Lançamentos Sem Membro Atribuído
                </Typography>
                <TransactionTable
                  transactions={[...unassignedIncomes, ...unassignedExpenses, ...unassignedSavings]}
                  members={members}
                  categories={categories}
                  onToggleStatus={onToggleStatus}
                  onEditTransaction={onEditTransaction}
                  onDeleteTransaction={onDeleteTransaction}
                  type="EXPENSE"
                  showMemberColumn={true}
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

export default PeriodSection;
