"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Loading from "@/components/admin-panel/loading";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Category } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function DashboardPage() {
  const [nameSortOrder, setNameSortOrder] = useState<"asc" | "desc">("asc");
  const [dateSortOrder, setDateSortOrder] = useState<"asc" | "desc">("asc");
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

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
                      <DropdownMenuItem onClick={() => setIsEdit(true)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ContentLayout>
  );
}
