'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import ProductImageAddDialog from '@/components/admin/product-images/AddDialog';

export default function ProductImageAddButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="">
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus /> Add Image
      </Button>
      <ProductImageAddDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
