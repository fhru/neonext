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
import { ProductFormValues } from '@/schema/product-schema';
import { UseFormReturn } from 'react-hook-form';
import MultiSelect from '@/components/admin/product/CategorySelector';
import { useState } from 'react';
import { Category } from '@/types';
import ImageUploader from '@/components/admin/product/ImageUploader';
import { uploadImagesToCloudinary } from '@/services/cloudinary-service';
import { Loader2 } from 'lucide-react';

interface ProductAddFormProps {
  form: UseFormReturn<ProductFormValues>;
  categories: Category[];
  onSubmit: (values: ProductFormValues) => void;
}

export default function ProductAddForm({ form, onSubmit, categories }: ProductAddFormProps) {
  const categoryOptions = categories.map((cat) => ({ id: cat.id, name: cat.name }));
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleFormSubmit = async (values: ProductFormValues) => {
    setIsLoading(true);

    try {
      let urls: string[] = [];

      if (files.length > 0) {
        urls = await uploadImagesToCloudinary(files);
      }

      const updatedValues = {
        ...values,
        categories: selectedCategories,
        images: urls.length > 0 ? urls : undefined,
      };

      onSubmit(updatedValues);

      form.reset();
      setSelectedCategories([]);
      setFiles([]);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Product name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" step={0.01} placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* stock */}
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type="number" step={1} placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* isActive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Active Product</FormLabel>
                  <FormDescription>Lorem ipsum dolor sit amet.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <MultiSelect
            options={categoryOptions}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Select Categories..."
          />
        </div>

        {/* image upload */}
        <ImageUploader files={files} setFiles={setFiles} />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </form>
    </Form>
  );
}
