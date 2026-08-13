export type TransactionType = "INCOME" | "EXPENSE" | "SAVINGS";

export const TransactionTypeEnum = {
  INCOME: "INCOME",
  EXPENSE: "EXPENSE",
  SAVINGS: "SAVINGS",
} as const;

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
  SAVINGS: "Reserva",
};

export default TransactionTypeEnum;
