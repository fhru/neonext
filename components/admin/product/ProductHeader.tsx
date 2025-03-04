import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import ProductAddDialog from '@/components/admin/product/ProductAddDialog';

export default function ProductHeader() {
  return (
    <div className="flex gap-4">
      <div className="relative w-full">
        <Search
          size={18}
          className="absolute top-[50%] -translate-y-[50%] left-2 text-foreground/50"
        />
        <Input className="pl-8 bg-background" placeholder="Search products..." />
      </div>
      <ProductAddDialog />
    </div>
  );
}
