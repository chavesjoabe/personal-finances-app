import httpClient, { isMockEnabled } from "./httpClient";
import { mockDatabase } from "./mockData";
import { MONTH_NAMES } from "../utils/dateFormatter";
import {
  YearSummaryResponse,
  YearSavingsResponse,
  YearMemberSummaryResponse,
  YearMonthlyDataResponse,
  MonthlySavingsResponse,
  MemberResponse,
} from "../types";

function calculateYearSummaryData(year: number): YearSummaryResponse {
  const allTransactions = mockDatabase.getTransactions();
  const members = mockDatabase.getMembers();
  const yearTransactions = allTransactions.filter((tx) => Number(tx.year) === Number(year));

  const memberSummaries: YearMemberSummaryResponse[] = members.map((member) => {
    const memberTxs = yearTransactions.filter((tx) => tx.memberId === member._id);
    const grossIncome = memberTxs
      .filter((tx) => tx.type === "INCOME")
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const totalExpenses = memberTxs
      .filter((tx) => tx.type === "EXPENSE")
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const totalSavings = memberTxs
      .filter((tx) => tx.type === "SAVINGS")
      .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    return {
      memberId: member._id,
      memberName: member.name,
      memberColor: member.color,
      grossIncome,
      totalExpenses,
      totalSavings,
      netBalance: grossIncome - totalExpenses,
    };
  });

  const coupleGross = memberSummaries.reduce((acc, curr) => acc + curr.grossIncome, 0);
  const coupleExpenses = memberSummaries.reduce((acc, curr) => acc + curr.totalExpenses, 0);
  const coupleSavings = memberSummaries.reduce((acc, curr) => acc + curr.totalSavings, 0);
  const coupleNet = coupleGross - coupleExpenses;

  const monthlyData: YearMonthlyDataResponse[] = MONTH_NAMES.map((name, index) => {
    const monthNum = index + 1;
    const txs = yearTransactions.filter((tx) => Number(tx.month) === monthNum);
    const income = txs.filter((tx) => tx.type === "INCOME").reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const expenses = txs.filter((tx) => tx.type === "EXPENSE").reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const savings = txs.filter((tx) => tx.type === "SAVINGS").reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const balance = income - expenses;

    return {
      month: monthNum,
      monthName: name,
      income,
      expenses,
      savings,
      balance,
      isPositive: balance >= 0,
    };
  });

  return {
    year: Number(year),
    couple: {
      grossIncome: coupleGross,
      totalExpenses: coupleExpenses,
      totalSavings: coupleSavings,
      netBalance: coupleNet,
    },
    members: memberSummaries,
    monthlyData,
  };
}

function calculateYearSavingsData(year: number): YearSavingsResponse {
  const allTransactions = mockDatabase.getTransactions();
  const members: MemberResponse[] = mockDatabase.getMembers();
  const yearTransactions = allTransactions.filter(
    (tx) => Number(tx.year) === Number(year) && tx.type === "SAVINGS"
  );

  let accumulatedTotal = 0;

  const monthlySavings: MonthlySavingsResponse[] = MONTH_NAMES.map((name, index) => {
    const monthNum = index + 1;
    const monthTxs = yearTransactions.filter((tx) => Number(tx.month) === monthNum);

    const perMember: Record<string, number> = {};
    let monthTotal = 0;

    members.forEach((member) => {
      const memberAmount = monthTxs
        .filter((tx) => tx.memberId === member._id)
        .reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
      perMember[member._id] = memberAmount;
      monthTotal += memberAmount;
    });

    accumulatedTotal += monthTotal;

    return {
      month: monthNum,
      monthName: name,
      perMember,
      monthTotal,
      accumulatedTotal,
    };
  });

  return {
    year: Number(year),
    members,
    totalSavingsYear: accumulatedTotal,
    monthlySavings,
  };
}

async function getYearSummary(year: number): Promise<YearSummaryResponse> {
  if (isMockEnabled()) {
    return calculateYearSummaryData(year);
  }
  const response = await httpClient.get<YearSummaryResponse>(`/years/${year}/summary`);
  return response.data;
}

async function getYearSavings(year: number): Promise<YearSavingsResponse> {
  if (isMockEnabled()) {
    return calculateYearSavingsData(year);
  }
  const response = await httpClient.get<YearSavingsResponse>(`/years/${year}/savings`);
  return response.data;
}

const yearService = {
  getYearSummary,
  getYearSavings,
};

export default yearService;
