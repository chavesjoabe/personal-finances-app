export type TransactionStatus = "PENDING" | "PAID";

export const TransactionStatusEnum = {
  PENDING: "PENDING",
  PAID: "PAID",
} as const;

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
};

export default TransactionStatusEnum;
