'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useSWR, { mutate } from 'swr';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { ProductFormSchema, ProductFormValues } from '@/schema/product-schema';
import { Category, Product } from '@/types';
import ProductEditForm from '@/components/admin/product/ProductEditForm';

interface ProductEditDialogProps {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const API_ENDPOINTS = {
  categories: '/api/admin/category',
  products: '/api/admin/products',
  product: (id: string) => `/api/admin/products/${id}`,
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductEditDialog({
  productId,
  open,
  onOpenChange,
}: ProductEditDialogProps) {
  // State management
  const [productCategories, setProductCategories] = useState<Category[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);

  // Data fetching
  const { data: categories, error: categoryError } = useSWR<Category[]>(
    API_ENDPOINTS.categories,
    fetcher,
  );

  const { data: product, error: productError } = useSWR<Product>(
    productId ? API_ENDPOINTS.product(productId) : null,
    fetcher,
  );

  // Form setup
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      description: '',
      isActive: false,
    },
  });

  // Update form when product data is loaded
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        price: Number(product.price),
        stock: product.stock,
        description: product.description,
        isActive: product.isActive,
      });

      setProductCategories(product.categories.map((cat) => cat.category));
      setProductImages(product.images.map((p) => p.url));
    }
  }, [product, form]);

  // Form submission handler
  async function onSubmit(values: ProductFormValues) {
    if (!productId) return;
    console.log(values);

    try {
      const response = await fetch(API_ENDPOINTS.product(productId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      toast.success(`${values.name} successfully updated`);

      onOpenChange(false);

      form.reset();

      mutate(API_ENDPOINTS.products);
      mutate(API_ENDPOINTS.product(productId));
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');

      onOpenChange(false);
    }
  }

  // Error handling
  if (categoryError || productError) {
    return <p>Error fetching data</p>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click submit when youre done.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          {product ? (
            <ProductEditForm
              form={form}
              onSubmit={onSubmit}
              categories={categories || []}
              productCategory={productCategories}
              productImages={productImages}
            />
          ) : (
            <div className="flex justify-center p-8">
              <Loader className="animate-spin" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
