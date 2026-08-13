import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from "@mui/material";
import formatCurrency from "../../../utils/currencyFormatter";
import { MemberResponse, MonthlySavingsResponse } from "../../../types";

interface SavingsTableProps {
  members?: MemberResponse[];
  monthlySavings?: MonthlySavingsResponse[];
}

export function SavingsTable({ members = [], monthlySavings = [] }: SavingsTableProps) {
  if (monthlySavings.length === 0) return null;

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: "#FFFFFF", border: "1px solid #E0E0E0" }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
        Detalhamento Mensal de Reservas
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Mês</TableCell>
            {members.map((member) => (
              <TableCell key={member._id} align="right" sx={{ fontWeight: 600 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: member.color || "#1976D2",
                    }}
                  />
                  <span>{member.name}</span>
                </Box>
              </TableCell>
            ))}
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Total do Mês
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>
              Total Acumulado
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {monthlySavings.map((row) => (
            <TableRow
              key={row.month}
              sx={{
                "&:hover": { backgroundColor: "#F9F9F9" },
              }}
            >
              <TableCell sx={{ fontWeight: 600 }}>{row.monthName}</TableCell>
              {members.map((member) => (
                <TableCell key={member._id} align="right" sx={{ color: "text.primary" }}>
                  {formatCurrency(row.perMember?.[member._id] || 0)}
                </TableCell>
              ))}
              <TableCell align="right" sx={{ fontWeight: 600, color: "primary.main" }}>
                {formatCurrency(row.monthTotal)}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: "success.main" }}>
                {formatCurrency(row.accumulatedTotal)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default SavingsTable;
