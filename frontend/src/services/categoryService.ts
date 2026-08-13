import httpClient, { isMockEnabled } from "./httpClient";
import { mockDatabase } from "./mockData";
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  TransactionType,
} from "../types";

async function getCategories(typeFilter?: TransactionType | null): Promise<CategoryResponse[]> {
  if (isMockEnabled()) {
    const categories = mockDatabase.getCategories();
    if (!typeFilter) return categories;
    return categories.filter((category) => category.type === typeFilter);
  }
  const response = await httpClient.get<CategoryResponse[]>("/categories", {
    params: typeFilter ? { type: typeFilter } : {},
  });
  return response.data;
}

async function createCategory(categoryData: CreateCategoryRequest): Promise<CategoryResponse> {
  if (isMockEnabled()) {
    const categories = mockDatabase.getCategories();
    const newCategory: CategoryResponse = {
      _id: `cat-${Date.now()}`,
      name: categoryData.name,
      type: categoryData.type,
      color: categoryData.color || "#ED7D31",
      isSystem: false,
      active: true,
    };
    categories.push(newCategory);
    mockDatabase.saveCategories(categories);
    return newCategory;
  }
  const response = await httpClient.post<CategoryResponse>("/categories", categoryData);
  return response.data;
}

async function updateCategory(
  categoryId: string,
  categoryData: UpdateCategoryRequest
): Promise<CategoryResponse> {
  if (isMockEnabled()) {
    const categories = mockDatabase.getCategories();
    const index = categories.findIndex((c) => c._id === categoryId);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...categoryData };
      mockDatabase.saveCategories(categories);
      return categories[index];
    }
    throw new Error("Category not found");
  }
  const response = await httpClient.put<CategoryResponse>(`/categories/${categoryId}`, categoryData);
  return response.data;
}

async function deleteCategory(categoryId: string): Promise<void> {
  if (isMockEnabled()) {
    const categories = mockDatabase.getCategories();
    const category = categories.find((c) => c._id === categoryId);
    if (!category) return;
    if (category.isSystem) {
      category.active = false;
    } else {
      const updated = categories.filter((c) => c._id !== categoryId);
      mockDatabase.saveCategories(updated);
      return;
    }
    mockDatabase.saveCategories(categories);
    return;
  }
  await httpClient.delete(`/categories/${categoryId}`);
}

const categoryService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
