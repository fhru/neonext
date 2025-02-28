'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ProductFormSchema, ProductFormValues } from '@/schema/product-schema';
import { CategorySelector } from '@/components/admin/product/CategorySelector';
import { ImageUpload } from '@/components/admin/product/ImageUpload';
import { useEffect, useState } from 'react';

type ProductFormProps = {
  onSubmit: (
    values: ProductFormValues,
    imageFiles: File[],
    selectedCategories: string[],
  ) => Promise<void>;
  categories: Category[];
  loading: boolean;
  uploadingImages: boolean;
};

export function ProductForm({ onSubmit, categories, loading, uploadingImages }: ProductFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      description: '',
      sku: '',
      isActive: true,
    },
  });

  const handleFormSubmit = async (values: ProductFormValues) => {
    await onSubmit(values, imageFiles, selectedCategories);
    setSelectedCategories([]);
    setImageFiles([]);
    setImagePreviews([]);
    form.reset();
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Informasi Dasar</h3>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      placeholder="0"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description*</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Deskripsi produk"
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="Kode produk (opsional)" {...field} />
                </FormControl>
                <FormDescription>SKU harus unik untuk setiap produk</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Status Aktif</FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    Aktifkan untuk menampilkan produk di toko
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Category */}
        <CategorySelector
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
        />

        {/* Image Upload */}
        <ImageUpload
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          imagePreviews={imagePreviews}
          setImagePreviews={setImagePreviews}
          loading={loading}
        />

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploadingImages ? 'Uploading images...' : 'Submitting...'}
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  );
}
