'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ProductAddDialog from '@/components/admin/product/ProductAddDialog';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProductImageHeader() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }
      router.replace(`/admin/product-image?${params.toString()}`, { scroll: false });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, router, searchParams]);

  return (
    <div className="flex gap-4">
      <div className="relative w-full">
        <Search
          size={18}
          className="absolute top-[50%] -translate-y-[50%] left-2 text-foreground/50"
        />
        <Input
          className="pl-8 bg-background"
          placeholder="Search Images..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ProductAddDialog />
    </div>
  );
}
