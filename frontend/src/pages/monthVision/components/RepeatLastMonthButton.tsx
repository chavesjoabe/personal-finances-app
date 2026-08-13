import { useState } from "react";
import { Button } from "@mui/material";
import AutoRenewIcon from "@mui/icons-material/Autorenew";
import ConfirmDialog from "../../../components/ConfirmDialog";

interface RepeatLastMonthButtonProps {
  onRepeat: () => Promise<void>;
  isSubmitting?: boolean;
  variant?: "contained" | "outlined" | "text";
}

export function RepeatLastMonthButton({
  onRepeat,
  isSubmitting = false,
  variant = "contained",
}: RepeatLastMonthButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const handleOpenConfirm = () => setConfirmOpen(true);
  const handleCloseConfirm = () => setConfirmOpen(false);

  const handleConfirmRepeat = async () => {
    handleCloseConfirm();
    await onRepeat();
  };

  return (
    <>
      <Button
        variant={variant}
        color="primary"
        startIcon={<AutoRenewIcon />}
        onClick={handleOpenConfirm}
        disabled={isSubmitting}
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          boxShadow: "0px 2px 8px rgba(25, 118, 210, 0.25)",
        }}
      >
        {isSubmitting ? "Repetindo..." : "Repetir Lançamentos do Mês Anterior"}
      </Button>

      <ConfirmDialog
        open={confirmOpen}
        title="Repetir Dados do Mês Anterior?"
        message="Isso copiará todas as receitas, despesas e reservas do mês anterior para este mês com o status PENDENTE. Você poderá ajustar os valores individuais depois."
        confirmLabel="Repetir Lançamentos"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmRepeat}
        onCancel={handleCloseConfirm}
        isDangerous={false}
      />
    </>
  );
}

export default RepeatLastMonthButton;
