'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate, formatPrice } from '@/lib/utils';
import { Check, Copy, Ellipsis, Loader, Pen, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';
import ProductEditDialog from '@/components/admin/product/ProductEditDialog';
import ProductTableSkeleton from '@/components/admin/product/ProductTableSkeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Product } from '@/types';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductTable({ search }: { search: string }) {
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<string | null>(null);

  const {
    data: products,
    error,
    mutate,
  } = useSWR<Product[]>(`/api/admin/products?search=${encodeURIComponent(search)}`, fetcher);

  const handleCopy = async (productId: string) => {
    try {
      await navigator.clipboard.writeText(productId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('ID Copied to Clipboard');
    } catch (err) {
      console.error('Gagal menyalin teks:', err);
    }
  };

  const confirmDelete = (productId: string) => {
    setProductToDelete(productId);
    setIsAlertOpen(true);
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/products/${productToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to Delete Product');
      }

      const data = await response.json();
      toast.success(data.message);

      mutate();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    } finally {
      setIsDeleting(false);
      setIsAlertOpen(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (productId: string) => {
    setProductToEdit(productId);
    setIsEditOpen(true);
  };

  if (!products) return <ProductTableSkeleton />;
  if (error)
    return (
      <Alert>
        <AlertTitle>Oops</AlertTitle>
        <AlertDescription>Error Fetching Data</AlertDescription>
      </Alert>
    );

  return (
    <div className="bg-background border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Images</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length !== 0 ? (
            products.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="max-w-44">{product.name}</TableCell>
                <TableCell>
                  {/* image popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <span>
                        <Button size={'icon'} variant={'ghost'}>
                          <Ellipsis />
                        </Button>
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit">
                      <div className="flex gap-2 flex-wrap">
                        {product.images.map((img) => (
                          <Image
                            key={img.id}
                            src={img.url}
                            alt={img.alt}
                            width={128}
                            height={128}
                            className="w-24 h-24 object-cover object-center border text-sm rounded"
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="max-w-64">{product.description}</TableCell>
                <TableCell>{formatPrice(Number(product.price))}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <span>
                        <Button size={'icon'} variant={'ghost'}>
                          <Ellipsis />
                        </Button>
                      </span>
                    </PopoverTrigger>
                    <PopoverContent className="text-sm flex flex-wrap gap-1 w-fit">
                      {product.categories.map((pc) => (
                        <Badge variant={'secondary'} key={pc.category.id}>
                          {pc.category.name}
                        </Badge>
                      ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>{formatDate(product.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <span>
                        <Button size={'icon'} variant={'ghost'}>
                          <Ellipsis />
                        </Button>
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleCopy(product.id)}>
                        {copied ? <Check /> : <Copy />}
                        Copy ID
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                        <Pen /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => confirmDelete(product.id)}>
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                <span>No Product Found With Name &quot;{search}&quot;</span>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* edit component */}
      <ProductEditDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        productId={productToEdit || ''}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Menghapus...
                </>
              ) : (
                'Hapus'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
