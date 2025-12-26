"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Category, categoryService } from "@/services/category";
import { Document, documentService } from "@/services/document";
import { Download, Eye, FileText, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Upload Form State
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    category: "",
    file: null as File | null,
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch documents and categories in parallel
      const [docsResponse, catsResponse] = await Promise.all([
        documentService.getAllDocuments({ search: searchTerm }),
        categoryService.getAllCategories(),
      ]);
      
      const docsList = (docsResponse as any).data || [];
      const catsList = (catsResponse as any).data || [];

      setDocuments(docsList);
      setCategories(catsList);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast.error("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm]); // Re-fetch when search changes (debounce ideally, but simple for now)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleUpload = async () => {
    if (!uploadData.file) {
      toast.error("Please select a file");
      return;
    }
    
    try {
      await documentService.uploadDocument({
        file: uploadData.file,
        title: uploadData.title || undefined,
        description: uploadData.description || undefined,
        category: uploadData.category || undefined,
      });
      
      setIsUploadDialogOpen(false);
      setUploadData({ title: "", description: "", category: "", file: null });
      fetchData();
      toast.success("Document uploaded successfully");
    } catch (error: any) {
      console.error("Upload failed", error);
      toast.error(error.response?.data?.message || "Failed to upload document");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await documentService.deleteDocument(id);
      fetchData();
      toast.success("Document deleted successfully");
    } catch (error: any) {
      console.error("Delete failed", error);
      toast.error(error.response?.data?.message || "Failed to delete document");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage and organize your documents here.
          </p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" /> Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>
                Upload a file (PDF, Word, Excel, Image) up to 10MB.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="Defaults to filename"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={uploadData.category}
                  onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!uploadData.file}>
                Upload
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center py-4 bg-white dark:bg-slate-900 px-4 rounded-lg border shadow-sm space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents by title..."
            className="pl-9 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="border rounded-lg bg-white dark:bg-slate-900 shadow-sm overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-800/50">
              <TableHead className="min-w-[200px]">Title</TableHead>
              <TableHead className="min-w-[120px]">Category</TableHead>
              <TableHead className="min-w-[150px]">Uploaded By</TableHead>
              <TableHead className="min-w-[100px]">Date</TableHead>
              <TableHead className="min-w-[100px]">Size</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Loading documents...
                </TableCell>
              </TableRow>
            ) : documents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No documents found.
                </TableCell>
              </TableRow>
            ) : (
              documents.map((doc) => (
                <TableRow key={doc._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                        <FileText className="h-4 w-4 text-slate-500" />
                      </div>
                      <div className="flex flex-col">
                        <span>{doc.title}</span>
                        {doc.description && (
                          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {doc.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {typeof doc.category === 'object' && doc.category && 'name' in doc.category
                      ? (doc.category as any).name 
                      : doc.category || "-"}
                  </TableCell>
                  <TableCell>
                    {typeof doc.uploadedBy === 'object' && doc.uploadedBy && 'name' in doc.uploadedBy
                      ? (doc.uploadedBy as any).name
                      : "Unknown"}
                  </TableCell>
                  <TableCell>{formatDate(doc.createdAt || doc.uploadedAt)}</TableCell>
                  <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(doc.fileUrl, '_blank')}>
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(doc.fileUrl, '_blank')}>
                          <Download className="mr-2 h-4 w-4" /> Download
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(doc._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
