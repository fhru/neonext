"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Input } from "@/components/ui/input";

export default function NewCategoryPage() {
  return (
    <ContentLayout title="New Category">
      <h1>Create a New Category</h1>
      <Input placeholder="Category Name" />
      <Input placeholder="Description" />
    </ContentLayout>
  );
}