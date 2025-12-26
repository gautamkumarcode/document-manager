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
import { Edit, FolderTree, MoreVertical, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getAllCategories();
      // Ensure data is array
      const list = (data as any).data || [];
      setCategories(list);
    } catch (error) {
      console.error("Failed to fetch categories", error);
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await categoryService.createCategory(formData);
      setIsAddDialogOpen(false);
      setFormData({ name: "", description: "" });
      fetchCategories();
      toast.success("Category created successfully");
    } catch (error: any) {
      console.error("Failed to create category", error);
      console.log("Error Response Data:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Failed to create category";
      toast.error(errorMessage);
    }
  };

  const handleUpdateCategory = async () => {
    if (!currentCategory) return;
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    try {
      await categoryService.updateCategory(currentCategory._id, formData);
      setIsEditDialogOpen(false);
      setCurrentCategory(null);
      setFormData({ name: "", description: "" });
      fetchCategories();
      toast.success("Category updated successfully");
    } catch (error: any) {
      console.error("Failed to update category", error);
      console.log("Error Response Data:", error.response?.data);
      const errorMessage = error.response?.data?.message || "Failed to update category";
      toast.error(errorMessage);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoryService.deleteCategory(id);
      fetchCategories();
      toast.success("Category deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete category", error);
      toast.error(error.response?.data?.message || "Failed to delete category");
    }
  };

  const openEditDialog = (category: Category) => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setIsEditDialogOpen(true);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Group documents into logical categories.
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>
                Create a new document category.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Finance, HR, Legal"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Can be Invoice, Report, etc"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCategory}>Create Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCategory}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex items-center py-4 bg-white dark:bg-slate-900 px-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
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
              <TableHead className="min-w-[200px]">Category Name</TableHead>
              <TableHead className="min-w-[200px]">Description</TableHead>
              <TableHead className="min-w-[150px]">Created By</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  Loading categories...
                </TableCell>
              </TableRow>
            ) : filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FolderTree className="h-4 w-4 text-slate-500" />
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {/* Assuming createdBy is populated with name/email */}
                    {typeof category.createdBy === 'object' && 'name' in category.createdBy 
                      ? (category.createdBy as any).name 
                      : 'Unknown'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(category)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteCategory(category._id)}
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
