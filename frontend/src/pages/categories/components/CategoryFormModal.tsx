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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from "../../../types";

const categorySchema = z.object({
  name: z.string().min(1, "Nome da categoria é obrigatório"),
  type: z.enum(["INCOME", "EXPENSE", "SAVINGS"]),
  color: z.string().min(1, "Cor é obrigatória"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

const defaultColors = [
  "#ED7D31",
  "#4CAF50",
  "#1976D2",
  "#9C27B0",
  "#E91E63",
  "#009688",
  "#FF9800",
  "#673AB7",
  "#795548",
  "#607D8B",
];

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateCategoryRequest | UpdateCategoryRequest, categoryId?: string | null) => Promise<void>;
  initialData?: CategoryResponse | null;
  isSubmitting?: boolean;
}

export function CategoryFormModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting = false,
}: CategoryFormModalProps) {
  const isEditing = Boolean(initialData?._id);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      type: initialData?.type || "EXPENSE",
      color: initialData?.color || "#ED7D31",
    },
  });

  const selectedColor = watch("color");

  useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name || "",
        type: initialData?.type || "EXPENSE",
        color: initialData?.color || "#ED7D31",
      });
    }
  }, [open, initialData, reset]);

  const handleFormSubmit = async (formData: CategoryFormData) => {
    try {
      await onSubmit(formData, initialData?._id);
      onClose();
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, pt: 2.5 }}>
        {isEditing ? "Editar Categoria" : "Nova Categoria"}
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={2.5}>
            {/* Category Name */}
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nome da Categoria"
                    placeholder="ex: Energia Elétrica, Bônus, Investimento..."
                    fullWidth
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>

            {/* Type */}
            <Grid item xs={12}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.type)}>
                    <InputLabel id="category-type-label">Tipo</InputLabel>
                    <Select {...field} labelId="category-type-label" label="Tipo" disabled={isEditing}>
                      <MenuItem value="INCOME">Receita</MenuItem>
                      <MenuItem value="EXPENSE">Despesa</MenuItem>
                      <MenuItem value="SAVINGS">Reserva</MenuItem>
                    </Select>
                    {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Color Palette Selection */}
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                Cor da Tag da Categoria
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {defaultColors.map((colorHex) => (
                  <Box
                    key={colorHex}
                    onClick={() => setValue("color", colorHex)}
                    sx={{
                      width: 28,
                      height: 28,
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
            {isSubmitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Categoria"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CategoryFormModal;
