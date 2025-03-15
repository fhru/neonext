'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { ProductImage } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Copy, Ellipsis, Pen, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductImageTable({ datas }: { datas?: ProductImage[] }) {
  const images = useMemo(() => datas ?? [], [datas]);
  const [copied, setCopied] = useState(false);

  if (images.length === 0) {
    return <div className="p-4 text-center text-gray-500">No product images found.</div>;
  }

  const handleCopy = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('ID Copied to Clipboard');
    } catch (err) {
      console.error('Gagal menyalin teks:', err);
    }
  };

  return (
    <div className="bg-background border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 px-4">No</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Alt Text</TableHead>
            <TableHead>Product ID</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {images.map((img, index) => (
            <TableRow key={img.id}>
              <TableCell className="px-4">{index + 1}</TableCell>
              <TableCell>
                {img.url ? (
                  <Image
                    src={img.url}
                    alt={img.alt || 'Product Image'}
                    width={50}
                    height={50}
                    className="rounded-md object-cover h-14 w-14"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </TableCell>
              <TableCell>{img.alt || '-'}</TableCell>
              <TableCell>{img.productId}</TableCell>
              <TableCell>{formatDate(img.updatedAt)}</TableCell>
              <TableCell className="text-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <span>
                      <Button size={'icon'} variant={'ghost'}>
                        <Ellipsis />
                      </Button>
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleCopy(img.id)}>
                      {copied ? <Check /> : <Copy />}
                      Copy ID
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Pen /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Trash2 />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
