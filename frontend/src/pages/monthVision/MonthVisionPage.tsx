import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Skeleton, Alert, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import useMonthVision from "./hooks/useMonthVision";
import MonthSummaryCards from "./components/MonthSummaryCards";
import PeriodSection from "./components/PeriodSection";
import RepeatLastMonthButton from "./components/RepeatLastMonthButton";
import TransactionFormModal from "./components/TransactionFormModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import EmptyState from "../../components/EmptyState";
import ExpenseBreakdownModal from "../../components/ExpenseBreakdownModal";
import memberService from "../../services/memberService";
import categoryService from "../../services/categoryService";
import { useSelectedPeriod } from "../../context/SelectedPeriodContext";
import { getMonthName } from "../../utils/dateFormatter";
import {
  MemberResponse,
  CategoryResponse,
  TransactionResponse,
  TransactionType,
  Period,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from "../../types";

export function MonthVisionPage() {
  const { selectedYear, selectedMonth } = useSelectedPeriod();
  const {
    monthVisionData,
    isLoading,
    loadError,
    isSubmitting,
    handleToggleStatus,
    handleSaveTransaction,
    handleDeleteTransaction,
    handleRepeatLastMonth,
  } = useMonthVision(selectedYear, selectedMonth);

  const [members, setMembers] = useState<MemberResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  // Modal State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [breakdownModalOpen, setBreakdownModalOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | null>(null);
  const [defaultType, setDefaultType] = useState<TransactionType>("EXPENSE");
  const [defaultPeriod, setDefaultPeriod] = useState<Period>("FIRST_HALF");
  const [defaultMemberId, setDefaultMemberId] = useState<string>("");

  // Confirm Delete Dialog State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([memberService.getMembers(), categoryService.getCategories()]).then(
      ([membersData, categoriesData]) => {
        if (isMounted) {
          setMembers(membersData);
          setCategories(categoriesData);
        }
      }
    );
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenCreateModal = (
    type: TransactionType = "EXPENSE",
    period: Period = "FIRST_HALF",
    memberId = ""
  ) => {
    setSelectedTransaction(null);
    setDefaultType(type);
    setDefaultPeriod(period);
    setDefaultMemberId(memberId);
    setModalOpen(true);
  };

  const handleOpenEditModal = (transaction: TransactionResponse) => {
    setSelectedTransaction(transaction);
    setDefaultType(transaction.type);
    setDefaultPeriod(transaction.period);
    setDefaultMemberId(transaction.memberId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleOpenDeleteConfirm = (transaction: TransactionResponse) => {
    setTransactionToDelete(transaction);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setTransactionToDelete(null);
    setDeleteConfirmOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete?._id) {
      await handleDeleteTransaction(transactionToDelete._id);
    }
    handleCloseDeleteConfirm();
  };

  const monthName = getMonthName(selectedMonth);

  const monthExpenses = useMemo(() => {
    if (!monthVisionData) return [];
    const first = monthVisionData.firstHalf?.expenses || [];
    const second = monthVisionData.secondHalf?.expenses || [];
    return [...first, ...second];
  }, [monthVisionData]);

  if (isLoading && !monthVisionData) {
    return (
      <Box sx={{ p: 1 }}>
        <Skeleton variant="text" width={250} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  if (loadError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Falha ao carregar os dados da visão mensal. Por favor, tente novamente.
      </Alert>
    );
  }

  const { firstHalf, secondHalf, summary, isEmpty } = monthVisionData || {};

  return (
    <Box>
      {/* Title & Actions Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            {monthName} de {selectedYear} — Visão Mensal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Receitas, despesas e reservas quinzenais do casal
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenCreateModal()}
            sx={{ fontWeight: 600, textTransform: "none", borderRadius: 2 }}
          >
            Novo Lançamento
          </Button>
          <RepeatLastMonthButton onRepeat={handleRepeatLastMonth} isSubmitting={isSubmitting} />
        </Box>
      </Box>

      {/* Top Summary Cards */}
      <MonthSummaryCards
        summary={summary}
        onOpenExpenseBreakdown={() => setBreakdownModalOpen(true)}
      />

      {/* Empty Month Alert / Callout */}
      {isEmpty && (
        <Box sx={{ my: 3 }}>
          <EmptyState
            title={`Nenhum lançamento registrado para ${monthName} de ${selectedYear}`}
            description="Você pode criar seu primeiro lançamento agora ou repetir as receitas e despesas recorrentes do mês anterior."
            actionLabel="+ Criar Primeiro Lançamento"
            onAction={() => handleOpenCreateModal()}
            secondaryActionLabel="Repetir Dados do Mês Anterior"
            onSecondaryAction={handleRepeatLastMonth}
          />
        </Box>
      )}

      {/* 1st Period */}
      <PeriodSection
        title="1ª Quinzena (Dias 1 – 15)"
        periodKey="FIRST_HALF"
        periodData={firstHalf}
        members={members}
        categories={categories}
        onToggleStatus={handleToggleStatus}
        onOpenCreateModal={handleOpenCreateModal}
        onEditTransaction={handleOpenEditModal}
        onDeleteTransaction={handleOpenDeleteConfirm}
        defaultExpanded
      />

      {/* 2nd Period */}
      <PeriodSection
        title="2ª Quinzena (Dias 16 – Fim)"
        periodKey="SECOND_HALF"
        periodData={secondHalf}
        members={members}
        categories={categories}
        onToggleStatus={handleToggleStatus}
        onOpenCreateModal={handleOpenCreateModal}
        onEditTransaction={handleOpenEditModal}
        onDeleteTransaction={handleOpenDeleteConfirm}
        defaultExpanded
      />

      {/* Form Modal */}
      <TransactionFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveTransaction as (formData: CreateTransactionRequest | UpdateTransactionRequest, transactionId?: string | null) => Promise<void>}
        initialData={selectedTransaction}
        defaultType={defaultType}
        defaultPeriod={defaultPeriod}
        defaultMemberId={defaultMemberId}
        members={members}
        categories={categories}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Excluir Lançamento?"
        message={`Tem certeza que deseja excluir "${transactionToDelete?.description || "este lançamento"}"?`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={handleCloseDeleteConfirm}
        isDangerous={true}
      />

      {/* Expense Breakdown Modal (Triggered by Total de Despesas Card) */}
      <ExpenseBreakdownModal
        open={breakdownModalOpen}
        onClose={() => setBreakdownModalOpen(false)}
        periodLabel={`${monthName} de ${selectedYear}`}
        totalExpenses={summary?.totalExpenses || 0}
        expenses={monthExpenses}
        categories={categories}
        members={members}
      />
    </Box>
  );
}

export default MonthVisionPage;
