'use client';

import { ContentLayout } from '@/components/admin-panel/content-layout';
import Loading from '@/components/admin-panel/loading';
import ProductTable from '@/components/admin/product/ProductTable';
import ProductHeader from '@/components/admin/product/ProductHeader';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductPage() {
  const { data, error, isLoading } = useSWR('/api/admin/products', fetcher);

  if (isLoading) return <Loading />;
  if (error) return <p>Error Fetching Data</p>;

  return (
    <ContentLayout title="Products">
      <div className="flex flex-col gap-4">
        {/* Search & add bar */}
        <ProductHeader />
        {/* Table */}
        <ProductTable products={data} />
      </div>
    </ContentLayout>
  );
}
