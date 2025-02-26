'use client';

import { AirVentIcon } from 'lucide-react';
import Link from 'next/link';
import NavUserMenu from '@/components/NavUserMenu';

export default function Navbar() {
  return (
    <div className="flex justify-between items-center max-w-screen-xl mx-auto h-16 border px-4">
      <Link href={'/'} className="flex gap-2 items-center">
        <AirVentIcon />
        <span className="font-bold">NeoNext</span>
      </Link>
      <div className="flex items-center gap-2">
        <NavUserMenu />
      </div>
    </div>
  );
}
