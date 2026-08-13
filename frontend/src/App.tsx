import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme/theme";
import { AuthProvider } from "./context/AuthContext";
import { SelectedPeriodProvider } from "./context/SelectedPeriodContext";
import AppRoutes from "./routes/AppRoutes";

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <SelectedPeriodProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SelectedPeriodProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
