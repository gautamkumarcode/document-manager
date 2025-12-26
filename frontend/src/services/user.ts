import api from "@/lib/api";
import { User } from "./auth";
export type { User };

// Define User types directly or reuse from auth if suitable, 
// but auth User might be minimal. Let's define a full one or reuse.
// The one in auth.ts is enough for now.

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

export const userService = {
  getAllUsers: async () => {
    const response = await api.get<{ success: boolean; data: User[] }>("/users");
    return response.data;
  },

  createUser: async (data: CreateUserData) => {
    const response = await api.post<{ success: boolean; data: User; message: string }>("/users", data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserData) => {
    const response = await api.put<{ success: boolean; data: User; message: string }>(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(`/users/${id}`);
    return response.data;
  },
};
