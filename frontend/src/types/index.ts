import { TransactionType } from "../models/transactionType";
import { TransactionStatus } from "../models/transactionStatus";
import { Period } from "../models/period";

export * from "../models/transactionType";
export * from "../models/transactionStatus";
export * from "../models/period";

// User & Auth DTOs
export interface UserResponse {
  _id: string;
  id?: string;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserResponse;
}

// Backend Response DTOs
export interface MemberResponse {
  _id: string;
  id?: string;
  name: string;
  color: string;
  active: boolean;
}

export interface CategoryResponse {
  _id: string;
  id?: string;
  name: string;
  type: TransactionType;
  color: string;
  isSystem: boolean;
  active?: boolean;
}

export interface TransactionResponse {
  _id: string;
  id?: string;
  memberId: string;
  categoryId: string;
  type: TransactionType;
  description?: string;
  amount: number;
  year: number;
  month: number;
  period: Period;
  status: TransactionStatus;
  paidAt?: string | null;
  copiedFrom?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PeriodSummaryResponse {
  period: Period;
  incomes: TransactionResponse[];
  expenses: TransactionResponse[];
  savings: TransactionResponse[];
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  balance: number;
}

export interface MonthVisionSummaryResponse {
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  netBalance: number;
  pendingCount: number;
  pendingAmount: number;
}

export interface MonthVisionResponse {
  year: number;
  month: number;
  firstHalf: PeriodSummaryResponse;
  secondHalf: PeriodSummaryResponse;
  summary: MonthVisionSummaryResponse;
  isEmpty: boolean;
}

export interface YearMemberSummaryResponse {
  memberId: string;
  memberName: string;
  memberColor: string;
  grossIncome: number;
  totalExpenses: number;
  totalSavings: number;
  netBalance: number;
}

export interface YearMonthlyDataResponse {
  month: number;
  monthName: string;
  income: number;
  expenses: number;
  savings: number;
  balance: number;
  isPositive: boolean;
}

export interface YearSummaryResponse {
  year: number;
  couple: {
    grossIncome: number;
    totalExpenses: number;
    totalSavings: number;
    netBalance: number;
  };
  members: YearMemberSummaryResponse[];
  monthlyData: YearMonthlyDataResponse[];
}

export interface MonthlySavingsResponse {
  month: number;
  monthName: string;
  perMember: Record<string, number>;
  monthTotal: number;
  accumulatedTotal: number;
}

export interface YearSavingsResponse {
  year: number;
  members: MemberResponse[];
  totalSavingsYear: number;
  monthlySavings: MonthlySavingsResponse[];
}

// Request DTOs
export interface CreateTransactionRequest {
  memberId: string;
  categoryId: string;
  type: TransactionType;
  description?: string;
  amount: number;
  year: number;
  month: number;
  period: Period;
  status: TransactionStatus;
  copiedFrom?: string | null;
}

export interface UpdateTransactionRequest {
  memberId?: string;
  categoryId?: string;
  type?: TransactionType;
  description?: string;
  amount?: number;
  period?: Period;
  status?: TransactionStatus;
}

export interface UpdateTransactionStatusRequest {
  status: TransactionStatus;
}

export interface CreateCategoryRequest {
  name: string;
  type: TransactionType;
  color?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  type?: TransactionType;
  color?: string;
  active?: boolean;
}

export interface CreateMemberRequest {
  name: string;
  color?: string;
}

export interface UpdateMemberRequest {
  name?: string;
  color?: string;
  active?: boolean;
}
