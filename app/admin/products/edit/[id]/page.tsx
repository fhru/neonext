/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ContentLayout } from '@/components/admin-panel/content-layout';
import { useEffect, useState } from 'react';
import { Category, Product } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Loading from '@/components/admin-panel/loading';
import ProductUpdateForm from '@/components/admin/product/UpdateForm';

export default function ProductEdit({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [initialValues, setInitialValues] = useState<Product>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // get product data
        const productRes = await fetch(`/api/admin/products/${params.id}`);
        if (!productRes.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData = await productRes.json();
        setProduct(productData);
        setInitialValues(productData);

        // Fetch categories
        const categoriesRes = await fetch('/api/admin/category');
        if (!categoriesRes.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading) return <Loading />;

  return (
    <ContentLayout title="Product Edit">
      <Card>
        <CardHeader>
          <CardTitle>{product?.name || 'Edit Product'}</CardTitle>
          <CardDescription>{product?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductUpdateForm categories={categories} initialValues={initialValues} />
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
