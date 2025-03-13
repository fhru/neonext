"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { CategoryForm } from "@/components/admin/category/CategoryForm";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState<Partial<{ name: string; description: string }> | undefined>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch(`/api/admin/category?id=${id}`);
        const data = await response.json();
        setInitialValues(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/admin/category?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      toast.success("Category updated successfully");
      router.push("/admin/categories");
      mutate("/api/admin/category");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <ContentLayout title="Edit Category">
      <Card>
        <CardHeader>
          <div className="flex my-2">
            <button
              onClick={() => router.push("/admin/categories")}
              className="back-button text-sm flex items-center transition hover:text-gray-300"
            >
              <span className="mr-1">←</span> Back
            </button>
          </div>
          <h1>Edit Category</h1>
        </CardHeader>
        <CardContent>
          <CategoryForm onSubmit={handleSubmit} loading={false} initialValues={initialValues} />
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
