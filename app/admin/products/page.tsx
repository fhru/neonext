'use client';

import { ContentLayout } from '@/components/admin-panel/content-layout';
import ProductTable from '@/components/admin/product/ProductTable';
import ProductHeader from '@/components/admin/product/ProductHeader';
import { useSearchParams } from 'next/navigation';

export default function ProductPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  return (
    <ContentLayout title="Products">
      <div className="flex flex-col gap-4">
        {/* Search & Add Bar */}
        <ProductHeader />
        {/* Table */}
        <ProductTable search={search} />
      </div>
    </ContentLayout>
  );
}
