/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ContentLayout } from '@/components/admin-panel/content-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Category } from '@/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { ProductForm } from '@/components/admin/product/ProductForm';
import { ProductFormSchema, ProductFormValues } from '@/schema/product-schema';

export default function ProductAdd() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/admin/category');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };
    fetchCategories();
  }, []);

  async function onSubmit(
    values: ProductFormValues,
    imageFiles: File[],
    selectedCategories: string[],
  ) {
    setLoading(true);

    try {
      let cloudinaryUrls: string[] = [];

      if (imageFiles.length > 0) {
        setUploadingImages(true);
        cloudinaryUrls = await uploadImages(imageFiles);
        setUploadingImages(false);
        toast.success(`${imageFiles.length} images uploaded successfully`);
      }

      // Prepare product data according to your schema
      const productData = {
        ...values,
        categories: selectedCategories,
        images: cloudinaryUrls,
      };

      // Send data to the API
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product');
      }

      const data = await response.json();
      toast.success('Product added successfully');
      console.log('Product added:', data);

      // Redirect to product list after successful creation
      router.push('/admin/products');
      mutate('/api/admin/products');
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  }

  async function uploadImages(files: File[]): Promise<string[]> {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      const data = await response.json();
      return data.secure_url;
    });

    return Promise.all(uploadPromises);
  }

  return (
    <ContentLayout title="Add Product">
      <Card>
        <CardHeader>
          <CardTitle>Add Product Form</CardTitle>
          <CardDescription>
            Tambahkan produk baru dengan informasi lengkap. Semua field dengan tanda * wajib diisi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            onSubmit={onSubmit}
            categories={categories}
            loading={loading}
            uploadingImages={uploadingImages}
          />
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
