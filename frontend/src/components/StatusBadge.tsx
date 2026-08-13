import type { MouseEvent } from "react";
import { Chip } from "@mui/material";
import { TransactionStatus, TRANSACTION_STATUS_LABELS, TransactionStatusEnum } from "../types";
import { COLOR_PALETTE } from "../constants/colors";

interface StatusBadgeProps {
  status?: TransactionStatus;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

const statusStyles: Record<TransactionStatus, { backgroundColor: string; color: string }> = {
  [TransactionStatusEnum.PENDING]: {
    backgroundColor: COLOR_PALETTE.statusPendingBg,
    color: COLOR_PALETTE.statusPendingText,
  },
  [TransactionStatusEnum.PAID]: {
    backgroundColor: COLOR_PALETTE.statusPaidBg,
    color: COLOR_PALETTE.statusPaidText,
  },
};

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  const currentStatus: TransactionStatus = status || TransactionStatusEnum.PENDING;
  const style = statusStyles[currentStatus] || statusStyles[TransactionStatusEnum.PENDING];
  const label = TRANSACTION_STATUS_LABELS[currentStatus] || currentStatus;

  return (
    <Chip
      label={label}
      onClick={onClick}
      size="small"
      sx={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        fontWeight: 600,
        borderRadius: 1.5,
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick
          ? {
              filter: "brightness(0.95)",
            }
          : {},
      }}
    />
  );
}

export default StatusBadge;
