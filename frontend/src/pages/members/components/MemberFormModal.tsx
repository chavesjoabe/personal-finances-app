import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { MemberResponse, CreateMemberRequest, UpdateMemberRequest } from "../../../types";

const memberSchema = z.object({
  name: z.string().min(1, "Nome do membro é obrigatório"),
  color: z.string().min(1, "Cor é obrigatória"),
});

export type MemberFormData = z.infer<typeof memberSchema>;

const defaultMemberColors = [
  "#E91E63",
  "#1976D2",
  "#9C27B0",
  "#4CAF50",
  "#FF9800",
  "#009688",
  "#673AB7",
  "#795548",
];

interface MemberFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateMemberRequest | UpdateMemberRequest, memberId?: string | null) => Promise<void>;
  initialData?: MemberResponse | null;
  isSubmitting?: boolean;
}

export function MemberFormModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}: MemberFormModalProps) {
  const isEditing = Boolean(initialData?._id);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      name: initialData?.name || "",
      color: initialData?.color || "#1976D2",
    },
  });

  const selectedColor = watch("color");

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || "",
        color: initialData?.color || "#1976D2",
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (formData: MemberFormData) => {
    try {
      await onSubmit(formData, initialData?._id);
      onClose();
    } catch (error) {
      console.error("Failed to save member:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, pt: 2.5 }}>
        {isEditing ? "Editar Membro" : "Novo Membro"}
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={2.5}>
            {/* Member Name */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome do Membro"
                    placeholder="ex: Marta, Joabe..."
                    fullWidth
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            {/* Identification Color */}
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                Cor do Emblema de Identificação
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                {defaultMemberColors.map((colorHex) => (
                  <Box
                    key={colorHex}
                    onClick={() => setValue("color", colorHex)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      backgroundColor: colorHex,
                      cursor: "pointer",
                      border: selectedColor === colorHex ? "3px solid #212121" : "2px solid transparent",
                      boxShadow: selectedColor === colorHex ? "0px 2px 6px rgba(0,0,0,0.3)" : "none",
                      transition: "transform 0.15s ease",
                      "&:hover": { transform: "scale(1.15)" },
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined" color="warning" disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Membro"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default MemberFormModal;
