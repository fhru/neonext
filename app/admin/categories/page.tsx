"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Loading from "@/components/admin-panel/loading";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Category } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function DashboardPage() {
  const [nameSortOrder, setNameSortOrder] = useState<"asc" | "desc">("asc");
  const [dateSortOrder, setDateSortOrder] = useState<"asc" | "desc">("asc");
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const router = useRouter();
  const { data, error } = useSWR<Category[]>(`/api/admin/category?name=${nameSortOrder}&date=${dateSortOrder}`, fetcher);
  const [categories, setCategories] = useState<Category[]>([]);

  if (error) return <p>Error Fetching Data</p>;

  useEffect(() => {
    if (data) {
      setCategories(data);
      setInitialLoading(false);
    }
  }, [data]);

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      const response = await fetch(`/api/admin/category?id=${selectedCategory.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      toast.success("Category deleted successfully");
      setCategories(prevCategories => prevCategories.filter(category => category.id !== selectedCategory.id));
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  if (initialLoading) return <Loading />;
  return (
    <ContentLayout title="Categories">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-bold">Categories List</h1>
        <Button onClick={() => router.push('/admin/categories/new-category')}>
          New Category
        </Button>
      </div>
      <div className="rounded-lg border mt-4 bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Name
                  <Button variant="ghost" size="icon" onClick={() => setNameSortOrder(nameSortOrder === "asc" ? "desc" : "asc")}>
                    {nameSortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Date Created
                  <Button variant="ghost" size="icon" onClick={() => setDateSortOrder(dateSortOrder === "asc" ? "desc" : "asc")}>
                    {dateSortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category: any, index) => (
              <TableRow key={category.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{formatDate(category.createdAt)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={"icon"} variant={"ghost"}>
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/admin/categories/${category.id}`)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => { setSelectedCategory(category); setIsDeleteDialogOpen(true); }}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this category?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContentLayout>
  );
}