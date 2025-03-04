'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ProductFormSchema, ProductFormValues } from '@/schema/product-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ProductAddForm from '@/components/admin/product/ProductAddForm';
import useSWR from 'swr';
import Loading from '@/components/admin-panel/loading';
import { Category } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductAddDialog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { data, error, isLoading } = useSWR('/api/admin/category', fetcher);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  function onSubmit(values: ProductFormValues) {
    console.log('submitted values', values);
  }

  if (isLoading) return <Loading />;
  if (error) return <p>Error Fetching Data</p>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Product</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <ProductAddForm form={form} onSubmit={onSubmit} categories={categories} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
