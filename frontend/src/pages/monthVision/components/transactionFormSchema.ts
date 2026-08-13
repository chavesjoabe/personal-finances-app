import { z } from "zod";

export const transactionFormSchema = z.object({
  memberId: z.string().min(1, "Seleção de membro é obrigatória"),
  categoryId: z.string().min(1, "Seleção de categoria é obrigatória"),
  type: z.enum(["INCOME", "EXPENSE", "SAVINGS"]),
  description: z.string().optional(),
  amount: z
    .preprocess(
      (val: unknown) => (val === "" || val === undefined ? undefined : Number(val)),
      z.number({ required_error: "Valor é obrigatório", invalid_type_error: "Valor deve ser um número" })
    )
    .refine((val: number) => val > 0, "Valor deve ser maior que zero"),
  period: z.enum(["FIRST_HALF", "SECOND_HALF"]),
  status: z.enum(["PENDING", "PAID"]),
});

export type TransactionFormData = z.infer<typeof transactionFormSchema>;

export default transactionFormSchema;
