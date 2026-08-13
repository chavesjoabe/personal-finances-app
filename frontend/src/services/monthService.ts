import httpClient, { isMockEnabled } from "./httpClient";
import { mockDatabase } from "./mockData";
import {
  MonthVisionResponse,
  PeriodSummaryResponse,
  Period,
  TransactionResponse,
} from "../types";

function calculateMonthData(year: number, month: number): MonthVisionResponse {
  const allTransactions = mockDatabase.getTransactions();
  const monthTransactions = allTransactions.filter(
    (tx) => Number(tx.year) === Number(year) && Number(tx.month) === Number(month)
  );

  const filterPeriod = (periodName: Period): PeriodSummaryResponse => {
    const list = monthTransactions.filter((tx) => tx.period === periodName);
    const incomes = list.filter((tx) => tx.type === "INCOME");
    const expenses = list.filter((tx) => tx.type === "EXPENSE");
    const savings = list.filter((tx) => tx.type === "SAVINGS");

    const totalIncome = incomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const totalSavings = savings.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const balance = totalIncome - totalExpense;

    return {
      period: periodName,
      incomes,
      expenses,
      savings,
      totalIncome,
      totalExpense,
      totalSavings,
      balance,
    };
  };

  const firstHalf = filterPeriod("FIRST_HALF");
  const secondHalf = filterPeriod("SECOND_HALF");

  const totalIncome = firstHalf.totalIncome + secondHalf.totalIncome;
  const totalExpenses = firstHalf.totalExpense + secondHalf.totalExpense;
  const totalSavings = firstHalf.totalSavings + secondHalf.totalSavings;
  const netBalance = totalIncome - totalExpenses;

  const pendingExpenses = monthTransactions.filter(
    (tx) => tx.type === "EXPENSE" && tx.status === "PENDING"
  );
  const pendingCount = pendingExpenses.length;
  const pendingAmount = pendingExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  return {
    year: Number(year),
    month: Number(month),
    firstHalf,
    secondHalf,
    summary: {
      totalIncome,
      totalExpenses,
      totalSavings,
      netBalance,
      pendingCount,
      pendingAmount,
    },
    isEmpty: monthTransactions.length === 0,
  };
}

async function getMonthVision(year: number, month: number): Promise<MonthVisionResponse> {
  if (isMockEnabled()) {
    return calculateMonthData(year, month);
  }
  const response = await httpClient.get<MonthVisionResponse>(`/months/${year}/${month}`);
  return response.data;
}

async function repeatPreviousMonth(targetYear: number, targetMonth: number): Promise<MonthVisionResponse> {
  let prevYear = Number(targetYear);
  let prevMonth = Number(targetMonth) - 1;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }

  if (isMockEnabled()) {
    const allTransactions = mockDatabase.getTransactions();
    const prevTransactions = allTransactions.filter(
      (tx) => Number(tx.year) === prevYear && Number(tx.month) === prevMonth
    );

    if (prevTransactions.length === 0) {
      throw new Error(`No transactions found in previous month (${prevMonth}/${prevYear}) to repeat.`);
    }

    const newCopies: TransactionResponse[] = prevTransactions.map((tx) => ({
      _id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      memberId: tx.memberId,
      categoryId: tx.categoryId,
      type: tx.type,
      description: tx.description,
      amount: tx.amount,
      year: Number(targetYear),
      month: Number(targetMonth),
      period: tx.period,
      status: "PENDING",
      paidAt: null,
      copiedFrom: tx._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    const updatedTransactions = [...allTransactions, ...newCopies];
    mockDatabase.saveTransactions(updatedTransactions);
    return calculateMonthData(targetYear, targetMonth);
  }

  const response = await httpClient.post<MonthVisionResponse>(`/months/${targetYear}/${targetMonth}/repeat-previous`);
  return response.data;
}

const monthService = {
  getMonthVision,
  repeatPreviousMonth,
};

export default monthService;
