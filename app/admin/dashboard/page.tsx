'use client';

import { ContentLayout } from '@/components/admin-panel/content-layout';
import Loading from '@/components/admin-panel/loading';
import { useUser } from '@clerk/nextjs';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const tables = [
  { table: 'categories', label: 'Categories' },
  { table: 'products', label: 'Products' },
  { table: 'orders', label: 'Orders' },
  { table: 'users', label: 'Users' },
];

export default function DashboardPage() {
  const { data, error } = useSWR('/api/admin/dashboard', fetcher);
  const { user, isLoaded } = useUser();

  if (error) return <p>Error Fetching Data</p>;
  if (!data || !isLoaded) return <Loading />;

  return (
    <ContentLayout title="Dashboard">
      <h1 className="text-xl">
        Welcome <span className="font-bold">{user?.fullName}</span>
      </h1>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {tables.map(({ table, label }) => (
          <div key={table} className="rounded-lg shadow border p-4 bg-background">
            <h1 className="text-lg">{label}</h1>
            <p className="font-bold text-2xl">{data[table] ?? 0}</p>
          </div>
        ))}
      </div>
    </ContentLayout>
  );
}
