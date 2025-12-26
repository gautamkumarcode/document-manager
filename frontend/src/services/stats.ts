import api from "@/lib/api";
import { Document } from "./document";

export interface DashboardStats {
  counts: {
    users: number;
    documents: number;
    categories: number;
    activeSessions: number;
  };
  recentDocuments: Document[];
}

export const statsService = {
  getDashboardStats: async () => {
    const response = await api.get<{ success: boolean; data: DashboardStats }>("/stats");
    return response.data;
  },
};
