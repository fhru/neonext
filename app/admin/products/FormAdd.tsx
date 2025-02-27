/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, X, Upload } from 'lucide-react';
import { useSWRConfig } from 'swr';
import { Category } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';

// Skema validasi yang diperluas
const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Nama produk harus minimal 2 karakter',
    })
    .max(50),
  price: z.coerce.number().nonnegative({
    message: 'Harga tidak boleh negatif',
  }),
  stock: z.coerce
    .number()
    .nonnegative({
      message: 'Stok tidak boleh negatif',
    })
    .default(0),
  description: z
    .string()
    .min(2, {
      message: 'Deskripsi harus minimal 2 karakter',
    })
    .max(1000),
  sku: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Tipe untuk gambar
interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isMain: boolean;
  file?: File;
}

export default function ProductAdd() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();

  // Mengambil kategori dari API
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch('/api/admin/category');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        toast.error('Gagal mengambil data kategori');
      }
    };
    getCategories();
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

  // Handler untuk toggle kategori
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
  };

  // Handler untuk preview gambar
  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Buat objek gambar untuk preview
      const newImages = files.map((file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        alt: file.name,
        isMain: images.length === 0 && index === 0, // Set gambar pertama sebagai utama jika belum ada
        file,
      }));
      setImages([...images, ...newImages]);
    }
  };

  // Handler untuk menghapus gambar
  const handleRemoveImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  // Handler untuk menetapkan gambar utama
  const setMainImage = (id: string) => {
    setImages(
      images.map((img) => ({
        ...img,
        isMain: img.id === id,
      })),
    );
  };

  // Reset form dan state ketika dialog ditutup
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setSelectedCategories([]);
      setImages([]);
    }
    setOpen(open);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      // Dalam implementasi nyata, upload gambar ke cloud storage dulu
      // dan gunakan URL yang dikembalikan
      const processedImages = images.map((img) => ({
        url: img.url, // Pada implementasi nyata, gunakan URL dari cloud storage
        alt: img.alt || '',
        isMain: img.isMain,
      }));

      // Siapkan data untuk API
      const productData = {
        ...values,
        categoryIds: selectedCategories,
        images: processedImages,
      };

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menambahkan produk');
      }

      toast.success('Produk berhasil ditambahkan!');
      form.reset();
      setSelectedCategories([]);
      setImages([]);
      setOpen(false);
      mutate('/api/admin/products');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tambah Produk Baru</DialogTitle>
          <DialogDescription>
            Tambahkan produk baru dengan informasi lengkap. Semua field dengan tanda * wajib diisi.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informasi Dasar */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Informasi Dasar</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Produk *</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama produk" {...field} />
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
                      <FormLabel>Harga *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                      <FormLabel>Stok</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                    <FormLabel>Deskripsi *</FormLabel>
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

            {/* Kategori */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Kategori</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryToggle(category.id)}
                    className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                      selectedCategories.includes(category.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {category.name}
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-sm text-muted-foreground">Tidak ada kategori tersedia</p>
                )}
              </div>
            </div>

            {/* Gambar Produk */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Gambar Produk</h3>

              <div className="border-2 border-dashed border-input p-4 rounded-md">
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">
                    Pilih gambar untuk diunggah
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagePreview}
                    className="hidden"
                  />
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  {images.map((img) => (
                    <div key={img.id} className="relative border rounded-md overflow-hidden">
                      <img src={img.url} alt={img.alt} className="w-full h-32 object-cover" />

                      <div className="absolute top-0 right-0 flex">
                        <button
                          type="button"
                          onClick={() => setMainImage(img.id)}
                          className={`p-1 text-xs ${
                            img.isMain
                              ? 'bg-green-500 text-white'
                              : 'bg-secondary text-secondary-foreground'
                          }`}
                          title={img.isMain ? 'Gambar Utama' : 'Jadikan Gambar Utama'}
                        >
                          {img.isMain ? 'Utama' : 'Set Utama'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className="p-1 bg-destructive text-destructive-foreground"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tombol Submit */}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Simpan Produk'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Import yang perlu ditambahkan (sesuaikan jika perlu)
function FormDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={className}>{children}</div>;
}
