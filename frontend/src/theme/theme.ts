import { createTheme } from "@mui/material/styles";
import { COLOR_PALETTE } from "../constants/colors";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: COLOR_PALETTE.background,
      paper: COLOR_PALETTE.cardBackground,
    },
    primary: {
      main: COLOR_PALETTE.primary,
      light: COLOR_PALETTE.primaryLight,
      dark: COLOR_PALETTE.primaryHover,
      contrastText: "#FFFFFF",
    },
    warning: {
      main: COLOR_PALETTE.warning,
      light: COLOR_PALETTE.warningLight,
      dark: COLOR_PALETTE.warningDark,
      contrastText: "#212121",
    },
    success: {
      main: "#2E7D32",
      light: COLOR_PALETTE.statusPaidBg,
    },
    grey: {
      200: COLOR_PALETTE.statusPendingBg,
      500: COLOR_PALETTE.statusPendingText,
    },
    text: {
      primary: COLOR_PALETTE.textPrimary,
      secondary: COLOR_PALETTE.textSecondary,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      color: COLOR_PALETTE.textPrimary,
    },
    h6: {
      fontWeight: 600,
      color: COLOR_PALETTE.textPrimary,
    },
    subtitle1: {
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "none",
          padding: "8px 16px",
          "&:hover": {
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          },
        },
        containedWarning: {
          backgroundColor: COLOR_PALETTE.warning,
          color: "#212121",
          "&:hover": {
            backgroundColor: COLOR_PALETTE.warningLight,
          },
        },
        outlinedWarning: {
          borderColor: COLOR_PALETTE.warning,
          color: COLOR_PALETTE.warningDark,
          "&:hover": {
            backgroundColor: "#FFF3E0",
            borderColor: COLOR_PALETTE.warningDark,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.04)",
          border: `1px solid ${COLOR_PALETTE.borderLight}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.04)",
          border: `1px solid ${COLOR_PALETTE.borderLight}`,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: "#FAFAFA",
          color: COLOR_PALETTE.textPrimary,
        },
      },
    },
  },
});

export default theme;
