/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ContentLayout } from '@/components/admin-panel/content-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import { Category } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative().default(0),
  description: z.string().min(2).max(1000),
  sku: z.string().optional(),
  isActive: z.boolean().default(true),
});

export default function ProductAdd() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      price: 0,
      stock: 0,
      description: '',
      sku: '',
      isActive: true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      // Upload images to Cloudinary only at form submission
      let cloudinaryUrls: string[] = [];

      if (imageFiles.length > 0) {
        setUploadingImages(true);

        const uploadPromises = imageFiles.map(async (file) => {
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

        cloudinaryUrls = await Promise.all(uploadPromises);
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

      // Reset form and state
      form.reset();
      setSelectedCategories([]);
      setImageFiles([]);

      // Clean up image previews
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImagePreviews([]);

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

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);

      const validFiles = newFiles.filter((file) => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB limit

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

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Category</h3>
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={cn(
                        'px-3 py-1 rounded-full text-sm cursor-pointer',
                        selectedCategories.includes(category.id)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground',
                      )}
                    >
                      {category.name}
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-sm text-muted-foreground">Tidak ada kategori tersedia</p>
                  )}
                </div>
              </div>

              {/* Gambar */}
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
                      disabled={loading}
                    />
                  </label>
                </div>

                {imageFiles.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {imageFiles.length} images selected (will be uploaded when you submit the form)
                  </p>
                )}

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
                        {index === 0 && (
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
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

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
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
