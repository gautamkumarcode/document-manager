import api from "@/lib/api";
import { User } from "./auth";

export interface Category {
  _id: string;
  name: string;
  description?: string;
  createdBy: User | string; // Populate might return object or just ID
  createdAt?: string;
  docCount?: number; // Optional, might be calculated or separate
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
}

export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get<{ success: boolean; data: Category[] }>("/categories");
    return response.data;
  },

  createCategory: async (data: CreateCategoryData) => {
    const response = await api.post<{ success: boolean; data: Category; message: string }>("/categories", data);
    return response.data;
  },

  updateCategory: async (id: string, data: UpdateCategoryData) => {
    const response = await api.put<{ success: boolean; data: Category; message: string }>(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/categories/${id}`);
    return response.data;
  },
};
