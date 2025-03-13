'use client';

import { useMemo } from 'react';
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

export default function ProductImageTable({ datas }: { datas?: ProductImage[] }) {
  // Handle jika datas undefined atau kosong
  const images = useMemo(() => datas ?? [], [datas]);

  if (images.length === 0) {
    return <div className="p-4 text-center text-gray-500">No product images found.</div>;
  }

  return (
    <div className="bg-background border rounded-lg p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">No</TableHead>
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
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                {img.url ? (
                  <Image
                    src={img.url}
                    alt={img.alt || 'Product Image'}
                    width={50}
                    height={50}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </TableCell>
              <TableCell>{img.alt || '-'}</TableCell>
              <TableCell>{img.productId}</TableCell>
              <TableCell>{formatDate(img.updatedAt)}</TableCell>
              <TableCell className="text-center">
                <Button variant="outline" onClick={() => alert(`Editing ${img.id}`)}>
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
