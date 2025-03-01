"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CategoryForm } from "@/components/admin/category/CategoryForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { mutate } from "swr";

export default function NewCategoryPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/admin/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create category");
      }

      toast.success('Category added successfully');
      router.push("/admin/categories");
      mutate("/api/admin/category");
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <ContentLayout title="New Category">
      <Card>
        <CardHeader>
          <h1>Create a New Category</h1>
        </CardHeader>
        <CardContent>
          <CategoryForm onSubmit={handleSubmit} loading={false} />
        </CardContent>
      </Card>
    </ContentLayout>
  );
}