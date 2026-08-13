import { useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  LinearProgress,
  Paper,
  Chip,
  IconButton,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import formatCurrency from "../utils/currencyFormatter";
import { TransactionResponse, CategoryResponse, MemberResponse } from "../types";

export interface ExpenseCategoryGroup {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  totalAmount: number;
  percentage: number;
  items: TransactionResponse[];
}

export interface ExpenseBreakdownModalProps {
  open: boolean;
  onClose: () => void;
  periodLabel?: string;
  totalExpenses: number;
  expenses: TransactionResponse[];
  categories?: CategoryResponse[];
  members?: MemberResponse[];
}

export function ExpenseBreakdownModal({
  open,
  onClose,
  periodLabel = "Mês Atual",
  totalExpenses,
  expenses = [],
  categories = [],
  members = [],
}: ExpenseBreakdownModalProps) {
  // 1. Group expense transactions by category and sort categories descending by total value
  const categoryGroups = useMemo(() => {
    const expenseOnly = expenses.filter((tx) => tx.type === "EXPENSE");
    const categoryMap: Record<string, { total: number; items: TransactionResponse[] }> = {};

    expenseOnly.forEach((tx) => {
      const catId = tx.categoryId || "uncategorized";
      if (!categoryMap[catId]) {
        categoryMap[catId] = { total: 0, items: [] };
      }
      categoryMap[catId].total += Number(tx.amount || 0);
      categoryMap[catId].items.push(tx);
    });

    const calculatedTotal = Object.values(categoryMap).reduce((acc, curr) => acc + curr.total, 0);
    const overallTotal = totalExpenses > 0 ? totalExpenses : calculatedTotal;

    const groups: ExpenseCategoryGroup[] = Object.keys(categoryMap).map((catId) => {
      const catObj = categories.find((c) => (c._id || c.id) === catId);
      const catName = catObj ? catObj.name : "Outras Despesas";
      const catColor = catObj ? catObj.color : "#ED7D31";
      const totalAmount = categoryMap[catId].total;
      const percentage = overallTotal > 0 ? (totalAmount / overallTotal) * 100 : 0;

      // Sort items within each category descending by amount
      const sortedItems = [...categoryMap[catId].items].sort(
        (a, b) => Number(b.amount || 0) - Number(a.amount || 0)
      );

      return {
        categoryId: catId,
        categoryName: catName,
        categoryColor: catColor,
        totalAmount,
        percentage,
        items: sortedItems,
      };
    });

    // CRITICAL: Sort categories by totalAmount DESCENDING (bigger value first)
    return groups.sort((a, b) => b.totalAmount - a.totalAmount);
  }, [expenses, categories, totalExpenses]);

  // Top expense category
  const topCategory = categoryGroups.length > 0 ? categoryGroups[0] : null;
  const totalItemCount = categoryGroups.reduce((acc, curr) => acc + curr.items.length, 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          bgcolor: "#FAFAFA",
        },
      }}
    >
      {/* Modal Header */}
      <DialogTitle sx={{ pb: 1, pt: 2, px: 3, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                p: 1,
                borderRadius: 2,
                bgcolor: "#FFEBEE",
                color: "error.main",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TrendingDownIcon />
            </Box>
            <Typography variant="h6" fontWeight={700}>
              Onde o Dinheiro Está Sendo Gasto
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Detalhamento das despesas de <strong>{periodLabel}</strong> — ordenadas do maior para o menor valor.
          </Typography>
        </Box>

        <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        {/* KPI Banner */}
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mb: 3,
            borderRadius: 2.5,
            bgcolor: "#FFFFFF",
            border: "1px solid #FFCDD2",
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
              Despesas Totais
            </Typography>
            <Typography variant="h4" fontWeight={800} color="error.main">
              {formatCurrency(totalExpenses)}
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

          {topCategory && (
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                Maior Ofensor
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: topCategory.categoryColor,
                  }}
                />
                <Typography variant="subtitle1" fontWeight={700}>
                  {topCategory.categoryName} ({formatCurrency(topCategory.totalAmount)})
                </Typography>
              </Box>
            </Box>
          )}

          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", sm: "block" } }} />

          <Box>
            <Chip
              icon={<ArrowDownwardIcon fontSize="small" />}
              label="Ordenado pelo Maior Valor"
              color="error"
              variant="outlined"
              size="small"
              sx={{ fontWeight: 700, borderRadius: 2 }}
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              {categoryGroups.length} categoria(s) • {totalItemCount} item(ns)
            </Typography>
          </Box>
        </Paper>

        {/* Empty State */}
        {categoryGroups.length === 0 && (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <ShoppingBagIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
            <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
              Nenhuma despesa registrada para o período selecionado.
            </Typography>
          </Box>
        )}

        {/* Categories List (Sorted Descending) */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {categoryGroups.map((group, index) => {
            return (
              <Accordion
                key={group.categoryId}
                elevation={0}
                defaultExpanded={index === 0} // Expand top expense by default
                sx={{
                  bgcolor: "#FFFFFF",
                  border: "1px solid #E0E0E0",
                  borderRadius: "12px !important",
                  "&:before": { display: "none" },
                  overflow: "hidden",
                  transition: "border-color 0.2s ease",
                  "&:hover": { borderColor: group.categoryColor },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{ px: 2.5, py: 1, "& .MuiAccordionSummary-content": { my: 1 } }}
                >
                  <Grid container spacing={2} alignItems="center">
                    {/* Rank Badge & Category Info */}
                    <Grid item xs={12} sm={5} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          bgcolor: index === 0 ? "#FFCDD2" : "#F5F5F5",
                          color: index === 0 ? "#B71C1C" : "text.secondary",
                          height: 24,
                          fontSize: "0.75rem",
                        }}
                      />
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          bgcolor: group.categoryColor,
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ overflow: "hidden" }}>
                        <Typography variant="subtitle2" fontWeight={700} noWrap>
                          {group.categoryName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {group.items.length} item(ns)
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Progress Bar & Percentage */}
                    <Grid item xs={7} sm={4}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(group.percentage, 100)}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: "#F0F0F0",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: group.categoryColor,
                                borderRadius: 4,
                              },
                            }}
                          />
                        </Box>
                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ minWidth: 42 }}>
                          {group.percentage.toFixed(1)}%
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Total Amount */}
                    <Grid item xs={5} sm={3} sx={{ textAlign: "right" }}>
                      <Typography variant="subtitle1" fontWeight={800} color="error.main">
                        {formatCurrency(group.totalAmount)}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2, bgcolor: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ mb: 1, display: "block", pt: 1.5 }}>
                    ITENS NESTA CATEGORIA (MAIOR PARA O MENOR VALOR)
                  </Typography>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {group.items.map((item) => {
                      const memberObj = members.find((m) => (m._id || m.id) === item.memberId);
                      const isPaid = item.status === "PAID";
                      const quinzenaText = item.period === "FIRST_HALF" ? "1ª Quinzena" : "2ª Quinzena";

                      return (
                        <Paper
                          key={item._id || item.id}
                          elevation={0}
                          sx={{
                            p: 1.5,
                            bgcolor: "#FFFFFF",
                            border: "1px solid #EEEEEE",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1,
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            {/* Member Badge */}
                            {memberObj && (
                              <Chip
                                icon={<PersonIcon style={{ fontSize: 14, color: "#FFFFFF" }} />}
                                label={memberObj.name}
                                size="small"
                                sx={{
                                  bgcolor: memberObj.color || "#1976D2",
                                  color: "#FFFFFF",
                                  fontWeight: 600,
                                  fontSize: "0.7rem",
                                  height: 22,
                                }}
                              />
                            )}

                            <Typography variant="body2" fontWeight={600}>
                              {item.description || "Sem descrição"}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Chip
                              label={quinzenaText}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: "0.68rem", fontWeight: 500 }}
                            />

                            <Chip
                              icon={isPaid ? <CheckCircleOutlineIcon style={{ fontSize: 14 }} /> : <PendingOutlinedIcon style={{ fontSize: 14 }} />}
                              label={isPaid ? "PAGO" : "PENDENTE"}
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                bgcolor: isPaid ? "#D9EAD3" : "#FFF3E0",
                                color: isPaid ? "#2E7D32" : "#E65100",
                              }}
                            />

                            <Typography variant="body2" fontWeight={700} color="text.primary" sx={{ minWidth: 90, textAlign: "right" }}>
                              {formatCurrency(item.amount)}
                            </Typography>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 600, px: 3 }}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ExpenseBreakdownModal;
