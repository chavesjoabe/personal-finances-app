import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StatusBadge from "../../../components/StatusBadge";
import formatCurrency from "../../../utils/currencyFormatter";
import TransactionStatusEnum from "../../../models/transactionStatus";
import {
  TransactionResponse,
  MemberResponse,
  CategoryResponse,
  TransactionType,
  TransactionStatus,
} from "../../../types";

interface TransactionTableProps {
  transactions?: TransactionResponse[];
  members?: MemberResponse[];
  categories?: CategoryResponse[];
  onToggleStatus?: (transactionId: string, currentStatus: TransactionStatus) => void;
  onEditTransaction?: (transaction: TransactionResponse) => void;
  onDeleteTransaction?: (transaction: TransactionResponse) => void;
  type?: TransactionType;
  showMemberColumn?: boolean;
}

export function TransactionTable({
  transactions = [],
  members = [],
  categories = [],
  onToggleStatus,
  onEditTransaction,
  onDeleteTransaction,
  type = "EXPENSE",
  showMemberColumn = false,
}: TransactionTableProps) {
  const getMember = (memberId: string): { name: string; color: string } => {
    const found = members.find((m) => m._id === memberId);
    return found ? { name: found.name, color: found.color } : { name: "Não identificado", color: "#9E9E9E" };
  };

  const getCategory = (categoryId: string): { name: string; color: string } => {
    const found = categories.find((c) => c._id === categoryId);
    return found ? { name: found.name, color: found.color } : { name: "Sem categoria", color: "#757575" };
  };

  const getTypeLabel = (transactionType: TransactionType): string => {
    switch (transactionType) {
      case "INCOME":
        return "receita";
      case "EXPENSE":
        return "despesa";
      case "SAVINGS":
        return "reserva";
      default:
        return "lançamento";
    }
  };

  if (transactions.length === 0) {
    return (
      <Box sx={{ py: 2.5, textAlign: "center", bgcolor: "#FAFAFA", borderRadius: 2, border: "1px dashed #E0E0E0" }}>
        <Typography variant="body2" color="text.secondary">
          Nenhum lançamento de {getTypeLabel(type)} nesta seção.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: "1px solid #E0E0E0" }}>
      <Table size="small" aria-label={`Tabela de transações de ${type}`}>
        <TableHead>
          <TableRow sx={{ bgcolor: "#FAFAFA" }}>
            {showMemberColumn && <TableCell sx={{ fontWeight: 600 }}>Membro</TableCell>}
            <TableCell sx={{ fontWeight: 600 }}>Categoria</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Descrição</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Valor
            </TableCell>
            {type === "EXPENSE" && <TableCell align="center" sx={{ fontWeight: 600 }}>Status</TableCell>}
            <TableCell align="right" sx={{ fontWeight: 600, width: 80 }}>
              Ações
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction) => {
            const member = getMember(transaction.memberId);
            const category = getCategory(transaction.categoryId);
            const isPaid = transaction.status === TransactionStatusEnum.PAID;

            const rowBg = type === "EXPENSE" ? (isPaid ? "#F2F9F0" : "#F8F9FA") : "#FFFFFF";

            return (
              <TableRow
                key={transaction._id}
                sx={{
                  backgroundColor: rowBg,
                  "&:hover": {
                    backgroundColor: isPaid ? "#EAF5E7" : "#F0F2F5",
                  },
                  transition: "background-color 0.15s ease",
                }}
              >
                {/* Member Badge (optional) */}
                {showMemberColumn && (
                  <TableCell>
                    <Chip
                      label={member.name}
                      size="small"
                      sx={{
                        backgroundColor: member.color + "22",
                        color: member.color,
                        borderColor: member.color,
                        fontWeight: 600,
                        borderRadius: 1.5,
                        border: "1px solid",
                      }}
                    />
                  </TableCell>
                )}

                {/* Category */}
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: category.color || "#1976D2",
                      }}
                    />
                    <Typography variant="body2" fontWeight={500}>
                      {category.name}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Description */}
                <TableCell>
                  <Typography variant="body2" color="text.secondary">
                    {transaction.description || "-"}
                  </Typography>
                </TableCell>

                {/* Amount */}
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    color={
                      type === "INCOME"
                        ? "success.main"
                        : type === "SAVINGS"
                        ? "primary.main"
                        : "text.primary"
                    }
                  >
                    {formatCurrency(transaction.amount)}
                  </Typography>
                </TableCell>

                {/* Payment Status (for expenses) */}
                {type === "EXPENSE" && (
                  <TableCell align="center">
                    <StatusBadge
                      status={transaction.status}
                      onClick={() => onToggleStatus && onToggleStatus(transaction._id, transaction.status)}
                    />
                  </TableCell>
                )}

                {/* Actions */}
                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Tooltip title="Editar lançamento">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEditTransaction && onEditTransaction(transaction)}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir lançamento">
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => onDeleteTransaction && onDeleteTransaction(transaction)}
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TransactionTable;
