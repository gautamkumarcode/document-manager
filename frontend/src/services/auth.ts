import api from "@/lib/api";
import { z } from "zod";

// Zod schemas for validation
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginCredentials = z.infer<typeof loginSchema>;

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
  user?: User; // Depending on backend response, sometimes user data is sent
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get<{ success: boolean; data: User }>("/auth/profile");
    return response.data.data;
  },

  logout: () => {
    // Backend doesn't have a logout endpoint usually for JWT, just clear client side
    // If backend has one, call it here.
    return Promise.resolve(); 
  }
};
