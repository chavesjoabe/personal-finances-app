import { useCallback, useEffect, useState } from "react";
import monthService from "../../../services/monthService";
import transactionService from "../../../services/transactionService";
import {
  MonthVisionResponse,
  TransactionStatus,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from "../../../types";

export interface UseMonthVisionReturn {
  monthVisionData: MonthVisionResponse | null;
  isLoading: boolean;
  loadError: Error | null;
  isSubmitting: boolean;
  reloadMonthVision: () => Promise<void>;
  handleToggleStatus: (transactionId: string, currentStatus: TransactionStatus) => Promise<void>;
  handleSaveTransaction: (
    transactionPayload: CreateTransactionRequest | UpdateTransactionRequest,
    transactionId?: string | null
  ) => Promise<void>;
  handleDeleteTransaction: (transactionId: string) => Promise<void>;
  handleRepeatLastMonth: () => Promise<void>;
}

export function useMonthVision(selectedYear: number, selectedMonth: number): UseMonthVisionReturn {
  const [monthVisionData, setMonthVisionData] = useState<MonthVisionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadMonthVision = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await monthService.getMonthVision(selectedYear, selectedMonth);
      setMonthVisionData(data);
    } catch (error) {
      console.error("Failed to load month vision data:", error);
      setLoadError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsLoading(false);
    }
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);
    monthService
      .getMonthVision(selectedYear, selectedMonth)
      .then((data) => {
        if (isMounted) {
          setMonthVisionData(data);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Failed to load month vision data:", error);
          setLoadError(error instanceof Error ? error : new Error(String(error)));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedYear, selectedMonth]);

  const handleToggleStatus = async (transactionId: string, currentStatus: TransactionStatus) => {
    const newStatus: TransactionStatus = currentStatus === "PAID" ? "PENDING" : "PAID";
    try {
      await transactionService.updateTransactionStatus(transactionId, newStatus);
      const data = await monthService.getMonthVision(selectedYear, selectedMonth);
      setMonthVisionData(data);
    } catch (error) {
      console.error("Failed to toggle transaction status:", error);
    }
  };

  const handleSaveTransaction = async (
    transactionPayload: CreateTransactionRequest | UpdateTransactionRequest,
    transactionId: string | null = null
  ) => {
    setIsSubmitting(true);
    try {
      if (transactionId) {
        await transactionService.updateTransaction(transactionId, transactionPayload as UpdateTransactionRequest);
      } else {
        await transactionService.createTransaction({
          ...(transactionPayload as CreateTransactionRequest),
          year: selectedYear,
          month: selectedMonth,
        });
      }
      const data = await monthService.getMonthVision(selectedYear, selectedMonth);
      setMonthVisionData(data);
    } catch (error) {
      console.error("Failed to save transaction:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    try {
      await transactionService.deleteTransaction(transactionId);
      const data = await monthService.getMonthVision(selectedYear, selectedMonth);
      setMonthVisionData(data);
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const handleRepeatLastMonth = async () => {
    setIsSubmitting(true);
    try {
      const data = await monthService.repeatPreviousMonth(selectedYear, selectedMonth);
      setMonthVisionData(data);
    } catch (error) {
      console.error("Failed to repeat last month transactions:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    monthVisionData,
    isLoading,
    loadError,
    isSubmitting,
    reloadMonthVision: loadMonthVision,
    handleToggleStatus,
    handleSaveTransaction,
    handleDeleteTransaction,
    handleRepeatLastMonth,
  };
}

export default useMonthVision;
