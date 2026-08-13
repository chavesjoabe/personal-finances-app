import { useEffect, useState, SyntheticEvent } from "react";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  Switch,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import categoryService from "../../services/categoryService";
import CategoryFormModal from "./components/CategoryFormModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest, TransactionType } from "../../types";

type CategoryTab = "ALL" | TransactionType;

export function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [activeTab, setActiveTab] = useState<CategoryTab>("ALL");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modal & Confirm State
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryResponse | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryResponse | null>(null);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleTabChange = (_event: SyntheticEvent, newValue: CategoryTab) => {
    setActiveTab(newValue);
  };

  const filteredCategories = categories.filter((cat) => {
    if (activeTab === "ALL") return true;
    return cat.type === activeTab;
  });

  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (category: CategoryResponse) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleSaveCategory = async (
    formData: CreateCategoryRequest | UpdateCategoryRequest,
    categoryId?: string | null
  ) => {
    setIsSubmitting(true);
    try {
      if (categoryId) {
        await categoryService.updateCategory(categoryId, formData as UpdateCategoryRequest);
      } else {
        await categoryService.createCategory(formData as CreateCategoryRequest);
      }
      await loadCategories();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (category: CategoryResponse) => {
    try {
      await categoryService.updateCategory(category._id, { active: !category.active });
      await loadCategories();
    } catch (error) {
      console.error("Failed to toggle category active status:", error);
    }
  };

  const handleOpenDeleteConfirm = (category: CategoryResponse) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete?._id) {
      await categoryService.deleteCategory(categoryToDelete._id);
      await loadCategories();
    }
    setDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  if (isLoading && categories.length === 0) {
    return (
      <Box sx={{ p: 1 }}>
        <Skeleton variant="text" width={250} height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Gerenciamento de Categorias
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure categorias de transação, cores e padrões do sistema
          </Typography>
        </Box>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenCreateModal}>
          Nova Categoria
        </Button>
      </Box>

      {/* Type Filter Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 3, bgcolor: "#FFFFFF", border: "1px solid #E0E0E0", mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2, pt: 1 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="abas de filtro de categoria">
            <Tab label="Todas as Categorias" value="ALL" sx={{ fontWeight: 600 }} />
            <Tab label="Receitas" value="INCOME" sx={{ fontWeight: 600 }} />
            <Tab label="Despesas" value="EXPENSE" sx={{ fontWeight: 600 }} />
            <Tab label="Reservas" value="SAVINGS" sx={{ fontWeight: 600 }} />
          </Tabs>
        </Box>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Nome da Categoria</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Tag do Sistema
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Status Ativo
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category._id} sx={{ "&:hover": { backgroundColor: "#F9F9F9" } }}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        backgroundColor: category.color || "#1976D2",
                      }}
                    />
                    <Typography variant="body2" fontWeight={600}>
                      {category.name}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    label={
                      category.type === "INCOME"
                        ? "Receita"
                        : category.type === "SAVINGS"
                        ? "Reserva"
                        : "Despesa"
                    }
                    size="small"
                    color={
                      category.type === "INCOME"
                        ? "success"
                        : category.type === "SAVINGS"
                        ? "primary"
                        : "default"
                    }
                    sx={{ fontWeight: 600, height: 22, fontSize: "0.75rem" }}
                  />
                </TableCell>

                <TableCell align="center">
                  {category.isSystem ? (
                    <Chip label="Padrão do Sistema" size="small" variant="outlined" sx={{ fontSize: "0.7rem" }} />
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Personalizada
                    </Typography>
                  )}
                </TableCell>

                <TableCell align="center">
                  <Switch
                    checked={category.active !== false}
                    onChange={() => handleToggleActive(category)}
                    size="small"
                    color="primary"
                  />
                </TableCell>

                <TableCell align="right">
                  <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Tooltip title="Editar categoria">
                      <IconButton size="small" color="primary" onClick={() => handleOpenEditModal(category)}>
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {!category.isSystem && (
                      <Tooltip title="Excluir categoria">
                        <IconButton size="small" color="warning" onClick={() => handleOpenDeleteConfirm(category)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Form Modal */}
      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveCategory as (formData: CreateCategoryRequest | UpdateCategoryRequest, categoryId?: string | null) => Promise<void>}
        initialData={selectedCategory}
        isSubmitting={isSubmitting}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Excluir Categoria?"
        message={`Tem certeza que deseja excluir a categoria "${categoryToDelete?.name}"?`}
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
        isDangerous={true}
      />
    </Box>
  );
}

export default CategoriesPage;
