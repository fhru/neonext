// product-image/page.tsx
'use server';

import { Suspense } from 'react';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import ProductImageTable from '@/components/admin/product-images/Table';
import ProductTableSkeleton from '@/components/admin/product/ProductTableSkeleton';
import ProductImageSearchBar from '@/components/admin/product-images/SearchBar';

async function fetchProductImages(query?: string) {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/product-image`);

    if (query) {
      url.searchParams.append('query', query);
    }

    const res = await fetch(url.toString(), {
      next: { revalidate: 10 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching product images:', error);
    return [];
  }
}

async function ProductImageSection({ searchQuery }: { searchQuery?: string }) {
  const datas = await fetchProductImages(searchQuery);
  return <ProductImageTable datas={datas} />;
}

export default async function Page({ searchParams }: { searchParams: { query?: string } }) {
  const { query } = searchParams;

  return (
    <ContentLayout title="Product Images">
      <div className="flex">
        <ProductImageSearchBar />
      </div>
      <Suspense fallback={<ProductTableSkeleton />} key={query}>
        <ProductImageSection searchQuery={query} />
      </Suspense>
    </ContentLayout>
  );
}
