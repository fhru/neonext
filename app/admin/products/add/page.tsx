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
import { Category } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().nonnegative().default(0),
  description: z.string().min(2).max(1000),
  sku: z.string().min(2).max(50).optional(),
  isActive: z.boolean().default(true),
});

export default function ProductAdd() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[] | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch('/api/admin/category');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        toast.error('Failed to fetch Category');
      }
    };
    fetchCategory();
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={0.1}
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
                          step={0.1}  
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
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
