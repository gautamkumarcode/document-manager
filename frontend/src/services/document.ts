import api from "@/lib/api";
import { User } from "./auth";
import { Category } from "./category";

export interface Document {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  publicId: string;
  fileType: string;
  fileSize: number;
  fileName: string;
  category: Category | string; // Populated or ID
  uploadedBy: User | string; // Populated or ID
  uploadedAt: string;
  createdAt: string;
}

export interface UploadDocumentData {
  title?: string;
  description?: string;
  category?: string;
  file: File;
}

export interface DocumentResponse {
  success: boolean;
  data: Document[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export const documentService = {
	getAllDocuments: async (params?: {
		page?: number;
		limit?: number;
		search?: string;
		category?: string;
	}) => {
		const response = await api.get<DocumentResponse>("/documents", { params });
		return response.data;
	},

	uploadDocument: async (data: UploadDocumentData) => {
		const formData = new FormData();
		if (data.title) formData.append("title", data.title);
		if (data.description) formData.append("description", data.description);
		if (data.category) formData.append("category", data.category);
		formData.append("file", data.file);

		const response = await api.post<{
			success: boolean;
			data: Document;
			message: string;
		}>("/documents/upload", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
		return response.data;
	},

	deleteDocument: async (id: string) => {
		const response = await api.delete<{ success: boolean; message: string }>(
			`/documents/${id}`
		);
		return response.data;
	},

	// Get view URL for document (proxied through backend)
	getViewUrl: (documentId: string) => {
		// This returns a URL to your backend proxy endpoint
		const baseUrl =
			process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
		return `${baseUrl}/documents/${documentId}/view`;
	},

	// Get download URL for document (proxied through backend)
	getDownloadUrl: (documentId: string) => {
		const baseUrl =
			process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
		return `${baseUrl}/documents/${documentId}/download`;
	},
};
