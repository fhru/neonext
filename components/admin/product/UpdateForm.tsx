/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProductFormSchema, ProductFormValues } from '@/schema/product-schema';
import { Category, Product } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { CategorySelector } from './CategorySelector';

interface ProductUpdateForm {
  categories: Category[];
  initialValues: Product | undefined;
}

export default function ProductUpdateForm({ categories, initialValues }: ProductUpdateForm) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialValues?.categories?.map((cat) => cat.category.id) || [],
  );

  // Image states
  const [imageUrls, setImageUrls] = useState<string[]>(
    initialValues?.images?.map((img) => img.url) || [],
  );
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      price: Number(initialValues?.price) || 0,
      stock: initialValues?.stock || 0,
      description: initialValues?.description || '',
      sku: initialValues?.sku || '',
      isActive: initialValues?.isActive || true,
    },
  });

  // Image upload handling functions
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      const validFiles = newFiles.filter((file) => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 2 * 1024 * 1024;

        if (!isValidType) {
          toast.error(`${file.name} is not a valid image file`);
        }

        if (!isValidSize) {
          toast.error(`${file.name} exceeds the 2MB size limit`);
        }

        return isValidType && isValidSize;
      });

      if (validFiles.length > 0) {
        // Store file objects for later upload
        setImageFiles((prev) => [...prev, ...validFiles]);

        // Create preview URLs
        const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
      }

      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    // Remove from arrays
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Function to upload images to Cloudinary
  const uploadToCloudinary = async (file: File): Promise<string> => {
    try {
      // Create a FormData instance for the file
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // Replace with your Cloudinary upload preset

      // Make the upload request to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };

  async function onSubmit(values: z.infer<typeof ProductFormSchema>) {
    setIsLoading(true);

    try {
      let uploadedImageUrls: string[] = [];

      // Upload new images to Cloudinary if any
      if (imageFiles.length > 0) {
        // Create a toast for upload progress
        const uploadToastId = toast.loading(`Uploading ${imageFiles.length} images...`);

        try {
          // Upload each image and collect URLs
          const uploadPromises = imageFiles.map((file) => uploadToCloudinary(file));
          uploadedImageUrls = await Promise.all(uploadPromises);

          toast.success('Images uploaded successfully', { id: uploadToastId });
        } catch (error) {
          toast.error('Failed to upload images', { id: uploadToastId });
          throw new Error('Image upload failed');
        }
      }

      // Combine existing and new image URLs
      const allImageUrls = [...imageUrls, ...uploadedImageUrls];

      // Create the product data to send to API
      const productData = {
        ...values,
        categories: selectedCategories,
        images: allImageUrls.map((url) => ({ url })),
      };

      // Make API request to update product
      const response = await fetch(`/api/admin/products/${initialValues?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update product');
      }

      toast.success('Product updated successfully');

      // Clear new image states after successful update
      imageFiles.forEach((_, index) => {
        if (imagePreviews[index]) {
          URL.revokeObjectURL(imagePreviews[index]);
        }
      });
      setImageFiles([]);
      setImagePreviews([]);

      // Update imageUrls with all successful uploads
      setImageUrls(allImageUrls);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update product');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0"
                      {...field}
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
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      placeholder="0"
                      {...field}
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
                <FormLabel>Description</FormLabel>
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <CategorySelector
            categories={categories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />

          {/* Integrated Image Upload Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm">Gambar Product</h3>
            <div className="border-2 border-dashed border-input rounded-md">
              <label className="flex flex-col items-center justify-center cursor-pointer p-4">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="mt-2 text-sm text-muted-foreground">
                  Pilih gambar untuk diunggah (gambar pertama akan menjadi gambar utama)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
              </label>
            </div>

            {imageFiles.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {imageFiles.length} images selected (will be uploaded when you submit the form)
              </p>
            )}

            {/* New Image Previews */}
            {imagePreviews.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">New Images</h4>
                <div className="flex gap-2 flex-wrap">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <div className="relative w-40 h-40">
                        <Image
                          src={preview}
                          alt={`Preview ${index}`}
                          fill
                          className="object-cover rounded-lg border"
                        />
                        {index === 0 && imageUrls.length === 0 && (
                          <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-br rounded-tl">
                            Main
                          </div>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1"
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Images */}
            {imageUrls.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Existing Images</h4>
                <div className="flex gap-2 flex-wrap">
                  {imageUrls.map((url, index) => (
                    <div key={`existing-${index}`} className="relative">
                      <div className="relative w-40 h-40">
                        <Image
                          src={url}
                          alt={`Product image ${index}`}
                          fill
                          className="object-cover rounded-lg border"
                        />
                        {index === 0 && imagePreviews.length === 0 && (
                          <div className="absolute top-0 left-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-br rounded-tl">
                            Main
                          </div>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1"
                        disabled={isLoading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
