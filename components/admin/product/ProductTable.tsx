'use client';

import { Button } from '@/components/ui/button';
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
import { Product } from '@/types';
import { Ellipsis } from 'lucide-react';
import Image from 'next/image';

export default function ProductTable({ products }: { products: Product[] }) {
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
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="max-w-44">{product.name}</TableCell>
              <TableCell>
                {/* image popover */}
                <Popover>
                  <PopoverTrigger>
                    <Button size={'icon'} variant={'outline'}>
                      <Ellipsis />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-fit">
                    <div className="flex gap-2 flex-wrap">
                      {product.images.map((img) => (
                        <Image
                          key={img.id}
                          src={img.url}
                          alt={img.alt}
                          width={64}
                          height={64}
                          className="w-24 border text-sm rounded"
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
                  <PopoverTrigger>
                    <Button size={'icon'} variant={'outline'}>
                      <Ellipsis />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="text-sm">
                    {product.categories.map((pc) => pc.category.name)}
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>{formatDate(product.createdAt)}</TableCell>
              <TableCell>
                <Button size={'icon'} variant={'outline'}>
                  <Ellipsis />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
