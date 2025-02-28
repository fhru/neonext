'use client';

import { ContentLayout } from '@/components/admin-panel/content-layout';
import Loading from '@/components/admin-panel/loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Ellipsis, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { formatDate, formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Product } from '@/types';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data, error } = useSWR<Product[]>('/api/admin/products', fetcher);
  const [products, setProducts] = useState<Product[]>([]);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  if (error) return <p>Error Fetching Data</p>;
  if (!data) return <Loading />;

  console.log(data);

  return (
    <ContentLayout title="Products">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-bold">Products Manager</h1>
        <Link href={'/admin/products/add'}>
          <Button variant={'outline'}>
            <Plus /> Add Product
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-lg border mt-4 bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Images</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Categories</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>

                {/* image */}
                <TableCell>
                  {product.images.map((pi) => (
                    <div key={pi.id}>
                      {pi.isMain && (
                        <Image
                          src={pi.url}
                          alt={pi.alt}
                          width={64}
                          height={64}
                          className="w-10 h-10 object-cover object-center rounded"
                        />
                      )}
                    </div>
                  ))}
                </TableCell>

                <TableCell>{product.name}</TableCell>
                <TableCell className="max-w-48 ">{product.description}</TableCell>
                <TableCell>{formatPrice(Number(product.price))}</TableCell>
                <TableCell>{product.stock}</TableCell>

                {/* categories */}
                <TableCell>
                  {product.categories.map((pc) => (
                    <div key={pc.category.id}>
                      <Badge variant={'secondary'} className="my-0.5 cursor-default">
                        {pc.category.name}
                      </Badge>
                    </div>
                  ))}
                </TableCell>

                <TableCell>{formatDate(product.createdAt)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={'icon'} variant={'ghost'}>
                        <Ellipsis />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setIsEdit(true)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* edit dialog */}
        <Dialog open={isEdit} onOpenChange={setIsEdit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ContentLayout>
  );
}
