import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import transactionFormSchema, { TransactionFormData } from "./transactionFormSchema";
import {
  MemberResponse,
  CategoryResponse,
  TransactionResponse,
  TransactionType,
  Period,
  CreateTransactionRequest,
  UpdateTransactionRequest,
} from "../../../types";

interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    formData: CreateTransactionRequest | UpdateTransactionRequest,
    transactionId?: string | null
  ) => Promise<void>;
  initialData?: TransactionResponse | null;
  defaultType?: TransactionType;
  defaultPeriod?: Period;
  defaultMemberId?: string;
  members?: MemberResponse[];
  categories?: CategoryResponse[];
  isSubmitting?: boolean;
}

export function TransactionFormModal({
  open,
  onClose,
  onSubmit,
  initialData = null,
  defaultType = "EXPENSE",
  defaultPeriod = "FIRST_HALF",
  defaultMemberId = "",
  members = [],
  categories = [],
  isSubmitting = false,
}: TransactionFormModalProps) {
  const isEditing = Boolean(initialData?._id || initialData?.id);
  const firstMemberId = members[0]?._id || members[0]?.id || "";

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      memberId: initialData?.memberId || defaultMemberId || firstMemberId,
      type: initialData?.type || defaultType,
      categoryId: initialData?.categoryId || "",
      description: initialData?.description || "",
      amount: initialData?.amount || 0,
      period: initialData?.period || defaultPeriod,
      status: initialData?.status || "PENDING",
    },
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (open) {
      const currentFirstMemberId = members[0]?._id || members[0]?.id || "";
      const targetMemberId = initialData?.memberId || defaultMemberId || currentFirstMemberId;
      reset({
        memberId: targetMemberId,
        type: initialData?.type || defaultType,
        categoryId: initialData?.categoryId || "",
        description: initialData?.description || "",
        amount: initialData?.amount || 0,
        period: initialData?.period || defaultPeriod,
        status: initialData?.status || "PENDING",
      });
    }
  }, [open, initialData, defaultType, defaultPeriod, defaultMemberId, members, reset]);

  const filteredCategories = categories.filter(
    (category) => category.type === selectedType && category.active !== false
  );

  const handleFormSubmit = async (formData: TransactionFormData) => {
    try {
      await onSubmit(formData as unknown as CreateTransactionRequest, initialData?._id || initialData?.id);
      onClose();
    } catch (error) {
      console.error("Form submit error:", error);
    }
  };

  const getTypeLabel = (type: TransactionType) => {
    switch (type) {
      case "INCOME":
        return "Receita";
      case "EXPENSE":
        return "Despesa";
      case "SAVINGS":
        return "Reserva";
      default:
        return "Lançamento";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, pt: 2.5 }}>
        {isEditing ? "Editar Lançamento" : `+ Nova ${getTypeLabel(selectedType)}`}
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent dividers sx={{ p: 3 }}>
          <Grid container spacing={2.5}>
            {/* Member Selector */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="memberId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.memberId)}>
                    <InputLabel id="member-select-label">Membro</InputLabel>
                    <Select
                      {...field}
                      value={field.value || ""}
                      labelId="member-select-label"
                      label="Membro"
                    >
                      {members.map((member) => {
                        const mId = member._id || member.id || "";
                        return (
                          <MenuItem key={mId} value={mId}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  backgroundColor: member.color || "#1976D2",
                                }}
                              />
                              <Typography variant="body2">{member.name}</Typography>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {errors.memberId && <FormHelperText>{errors.memberId.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Transaction Type */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.type)}>
                    <InputLabel id="type-select-label">Tipo</InputLabel>
                    <Select
                      {...field}
                      value={field.value || "EXPENSE"}
                      labelId="type-select-label"
                      label="Tipo"
                      onChange={(event) => {
                        field.onChange(event);
                        setValue("categoryId", "");
                      }}
                    >
                      <MenuItem value="INCOME">Receita</MenuItem>
                      <MenuItem value="EXPENSE">Despesa</MenuItem>
                      <MenuItem value="SAVINGS">Reserva</MenuItem>
                    </Select>
                    {errors.type && <FormHelperText>{errors.type.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Category Selector */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.categoryId)}>
                    <InputLabel id="category-select-label">Categoria</InputLabel>
                    <Select
                      {...field}
                      value={field.value || ""}
                      labelId="category-select-label"
                      label="Categoria"
                    >
                      {filteredCategories.map((category) => {
                        const cId = category._id || category.id || "";
                        return (
                          <MenuItem key={cId} value={cId}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box
                                sx={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  backgroundColor: category.color || "#1976D2",
                                }}
                              />
                              <Typography variant="body2">{category.name}</Typography>
                            </Box>
                          </MenuItem>
                        );
                      })}
                    </Select>
                    {errors.categoryId && <FormHelperText>{errors.categoryId.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Period Selector */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="period"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.period)}>
                    <InputLabel id="period-select-label">Quinzena / Período</InputLabel>
                    <Select
                      {...field}
                      value={field.value || "FIRST_HALF"}
                      labelId="period-select-label"
                      label="Quinzena / Período"
                    >
                      <MenuItem value="FIRST_HALF">1ª Quinzena (Dias 1-15)</MenuItem>
                      <MenuItem value="SECOND_HALF">2ª Quinzena (Dias 16-Fim)</MenuItem>
                    </Select>
                    {errors.period && <FormHelperText>{errors.period.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Amount */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="amount"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Valor (R$)"
                    type="number"
                    fullWidth
                    inputProps={{ step: "0.01", min: "0" }}
                    error={Boolean(errors.amount)}
                    helperText={errors.amount?.message}
                  />
                )}
              />
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={Boolean(errors.status)}>
                    <InputLabel id="status-select-label">Status</InputLabel>
                    <Select
                      {...field}
                      value={field.value || "PENDING"}
                      labelId="status-select-label"
                      label="Status"
                    >
                      <MenuItem value="PENDING">Pendente (Não pago)</MenuItem>
                      <MenuItem value="PAID">Pago</MenuItem>
                    </Select>
                    {errors.status && <FormHelperText>{errors.status.message}</FormHelperText>}
                  </FormControl>
                )}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Descrição (Opcional)"
                    placeholder="ex: Conta de luz, bônus de salário..."
                    fullWidth
                    error={Boolean(errors.description)}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} variant="outlined" color="warning" disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : isEditing ? "Salvar Alterações" : "Criar Lançamento"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TransactionFormModal;
