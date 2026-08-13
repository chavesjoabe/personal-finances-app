import httpClient, { isMockEnabled } from "./httpClient";
import { mockDatabase } from "./mockData";
import {
  TransactionResponse,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionStatus,
} from "../types";

async function createTransaction(
  transactionPayload: CreateTransactionRequest
): Promise<TransactionResponse> {
  if (isMockEnabled()) {
    const transactions = mockDatabase.getTransactions();
    const newTransaction: TransactionResponse = {
      _id: `tx-${Date.now()}`,
      memberId: transactionPayload.memberId,
      categoryId: transactionPayload.categoryId,
      type: transactionPayload.type,
      description: transactionPayload.description || "",
      amount: Number(transactionPayload.amount),
      year: Number(transactionPayload.year),
      month: Number(transactionPayload.month),
      period: transactionPayload.period,
      status: transactionPayload.status || "PENDING",
      paidAt: transactionPayload.status === "PAID" ? new Date().toISOString() : null,
      copiedFrom: transactionPayload.copiedFrom || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    mockDatabase.saveTransactions(transactions);
    return newTransaction;
  }
  const response = await httpClient.post<TransactionResponse>("/transactions", transactionPayload);
  return response.data;
}

async function updateTransaction(
  transactionId: string,
  transactionPayload: UpdateTransactionRequest
): Promise<TransactionResponse> {
  if (isMockEnabled()) {
    const transactions = mockDatabase.getTransactions();
    const index = transactions.findIndex((tx) => tx._id === transactionId);
    if (index !== -1) {
      const existing = transactions[index];
      const updated: TransactionResponse = {
        ...existing,
        ...transactionPayload,
        amount: Number(transactionPayload.amount ?? existing.amount),
        updatedAt: new Date().toISOString(),
      };
      if (transactionPayload.status === "PAID" && !updated.paidAt) {
        updated.paidAt = new Date().toISOString();
      } else if (transactionPayload.status === "PENDING") {
        updated.paidAt = null;
      }
      transactions[index] = updated;
      mockDatabase.saveTransactions(transactions);
      return updated;
    }
    throw new Error("Transaction not found");
  }
  const response = await httpClient.put<TransactionResponse>(`/transactions/${transactionId}`, transactionPayload);
  return response.data;
}

async function updateTransactionStatus(
  transactionId: string,
  newStatus: TransactionStatus
): Promise<TransactionResponse> {
  if (isMockEnabled()) {
    const transactions = mockDatabase.getTransactions();
    const index = transactions.findIndex((tx) => tx._id === transactionId);
    if (index !== -1) {
      transactions[index].status = newStatus;
      transactions[index].paidAt = newStatus === "PAID" ? new Date().toISOString() : null;
      transactions[index].updatedAt = new Date().toISOString();
      mockDatabase.saveTransactions(transactions);
      return transactions[index];
    }
    throw new Error("Transaction not found");
  }
  const response = await httpClient.patch<TransactionResponse>(`/transactions/${transactionId}/status`, {
    status: newStatus,
  });
  return response.data;
}

async function deleteTransaction(transactionId: string): Promise<void> {
  if (isMockEnabled()) {
    const transactions = mockDatabase.getTransactions();
    const updated = transactions.filter((tx) => tx._id !== transactionId);
    mockDatabase.saveTransactions(updated);
    return;
  }
  await httpClient.delete(`/transactions/${transactionId}`);
}

const transactionService = {
  createTransaction,
  updateTransaction,
  updateTransactionStatus,
  deleteTransaction,
};

export default transactionService;
