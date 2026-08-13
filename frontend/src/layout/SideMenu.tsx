import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BarChartIcon from "@mui/icons-material/BarChart";
import SavingsIcon from "@mui/icons-material/Savings";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAuth } from "../context/AuthContext";

export const EXPANDED_DRAWER_WIDTH = 240;
export const COLLAPSED_DRAWER_WIDTH = 72;

interface MenuItem {
  label: string;
  path: string;
  icon: React.ReactElement;
}

const menuItems: MenuItem[] = [
  { label: "Visão Mensal", path: "/", icon: <CalendarMonthIcon /> },
  { label: "Visão Anual", path: "/year-vision", icon: <BarChartIcon /> },
  { label: "Reservas", path: "/savings", icon: <SavingsIcon /> },
  { label: "Categorias", path: "/categories", icon: <CategoryIcon /> },
  { label: "Membros", path: "/members", icon: <PeopleIcon /> },
];

interface SideMenuProps {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SideMenu({
  mobileOpen,
  onDrawerToggle,
  isCollapsed,
  onToggleCollapse,
}: SideMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (mobileOpen) {
      onDrawerToggle();
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderDrawerContent = (collapsedState: boolean) => (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#FFFFFF" }}>
      {/* Brand Header & Minimize Toggle Button */}
      <Box
        sx={{
          p: collapsedState ? 1.5 : 2,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsedState ? "center" : "space-between",
          minHeight: 64,
        }}
      >
        {!collapsedState ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, overflow: "hidden" }}>
            <AccountBalanceWalletIcon sx={{ color: "primary.main", fontSize: 28, flexShrink: 0 }} />
            <Box sx={{ overflow: "hidden" }}>
              <Typography variant="subtitle1" fontWeight={700} color="primary.main" lineHeight={1.2} noWrap>
                Finanças
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap display="block">
                Organizador do Casal
              </Typography>
            </Box>
          </Box>
        ) : (
          <Tooltip title="Expandir Menu" placement="right">
            <IconButton onClick={onToggleCollapse} color="primary" size="small">
              <AccountBalanceWalletIcon sx={{ fontSize: 26 }} />
            </IconButton>
          </Tooltip>
        )}

        {!collapsedState && (
          <Tooltip title="Recolher Menu" placement="left">
            <IconButton onClick={onToggleCollapse} size="small" sx={{ color: "text.secondary" }}>
              <ChevronLeftIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Collapse Quick Button when Minimized */}
      {collapsedState && (
        <Box sx={{ display: "flex", justifyContent: "center", pb: 1 }}>
          <Tooltip title="Expandir Menu" placement="right">
            <IconButton onClick={onToggleCollapse} size="small" sx={{ color: "text.secondary", bgcolor: "#F5F5F5" }}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      <Divider />

      {/* Navigation Links */}
      <List sx={{ px: collapsedState ? 1 : 1.5, py: 2, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isSelected =
            item.path === "/"
              ? location.pathname === "/" || location.pathname === "/month-vision"
              : location.pathname.startsWith(item.path);

          const navButton = (
            <ListItemButton
              selected={isSelected}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                justifyContent: collapsedState ? "center" : "initial",
                px: collapsedState ? 1.5 : 2,
                py: 1.2,
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "#FFFFFF",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "#FFFFFF",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsedState ? 0 : 40,
                  justifyContent: "center",
                  color: isSelected ? "#FFFFFF" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsedState && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: "0.95rem",
                  }}
                />
              )}
            </ListItemButton>
          );

          return (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              {collapsedState ? (
                <Tooltip title={item.label} placement="right" arrow>
                  {navButton}
                </Tooltip>
              ) : (
                navButton
              )}
            </ListItem>
          );
        })}
      </List>

      {/* User Section & Logout */}
      {user && (
        <Box sx={{ p: collapsedState ? 1.5 : 2, borderTop: "1px solid #E0E0E0", textAlign: collapsedState ? "center" : "left" }}>
          {!collapsedState ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 36, height: 36, fontSize: "0.9rem", fontWeight: 700 }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Box sx={{ overflow: "hidden" }}>
                  <Typography variant="subtitle2" fontWeight={600} noWrap>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap display="block">
                    {user.email}
                  </Typography>
                </Box>
              </Box>
              <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: "#ED7D31", py: 0.8 }}>
                <ListItemIcon sx={{ minWidth: 36, color: "#ED7D31" }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Sair" primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }} />
              </ListItemButton>
            </>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <Tooltip title={`${user.name} (${user.email})`} placement="right" arrow>
                <Avatar sx={{ bgcolor: "primary.main", width: 34, height: 34, fontSize: "0.85rem", fontWeight: 700 }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </Avatar>
              </Tooltip>

              <Tooltip title="Sair" placement="right" arrow>
                <IconButton onClick={handleLogout} size="small" sx={{ color: "#ED7D31", p: 0.8 }}>
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer (Always expanded when open) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: EXPANDED_DRAWER_WIDTH },
        }}
      >
        {renderDrawerContent(false)}
      </Drawer>

      {/* Desktop Permanent Drawer (Collapsible between Expanded and Minimized) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: isCollapsed ? COLLAPSED_DRAWER_WIDTH : EXPANDED_DRAWER_WIDTH,
          flexShrink: 0,
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          "& .MuiDrawer-paper": {
            width: isCollapsed ? COLLAPSED_DRAWER_WIDTH : EXPANDED_DRAWER_WIDTH,
            boxSizing: "border-box",
            borderRight: "1px solid #E0E0E0",
            overflowX: "hidden",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
        open
      >
        {renderDrawerContent(isCollapsed)}
      </Drawer>
    </>
  );
}

export default SideMenu;

