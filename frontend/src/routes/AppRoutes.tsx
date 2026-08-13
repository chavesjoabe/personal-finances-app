import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import MonthVisionPage from "../pages/monthVision/MonthVisionPage";
import YearVisionPage from "../pages/yearVision/YearVisionPage";
import SavingsPage from "../pages/savings/SavingsPage";
import CategoriesPage from "../pages/categories/CategoriesPage";
import MembersPage from "../pages/members/MembersPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<MonthVisionPage />} />
        <Route path="/month-vision" element={<MonthVisionPage />} />
        <Route path="/year-vision" element={<YearVisionPage />} />
        <Route path="/savings" element={<SavingsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
