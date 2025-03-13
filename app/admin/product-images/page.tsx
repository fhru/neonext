'use server';

import { ContentLayout } from '@/components/admin-panel/content-layout';
import ProductImageTable from '@/components/admin/product-images/Table';

export default async function Page() {
  let datas = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/product-image`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.statusText}`);
    }

    datas = await res.json();
  } catch (error) {
    console.error('Error fetching product images:', error);
  }

  return (
    <ContentLayout title="Product Images">
      <ProductImageTable datas={datas} />
    </ContentLayout>
  );
}
