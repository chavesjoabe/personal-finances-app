import { Box, Typography, Button } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function EmptyState({
  title = "Nenhum dado encontrado",
  description = "Não há registros para este período.",
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 5,
        px: 2,
        textAlign: "center",
        backgroundColor: "#FAFAFA",
        borderRadius: 2,
        border: "1px dashed #E0E0E0",
      }}
    >
      <InboxOutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
      <Typography variant="subtitle1" fontWeight={600} color="text.primary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mb: (actionLabel || secondaryActionLabel) ? 2 : 0 }}>
        {description}
      </Typography>
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center", mt: 1 }}>
        {actionLabel && onAction && (
          <Button variant="contained" size="small" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outlined" size="small" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default EmptyState;
