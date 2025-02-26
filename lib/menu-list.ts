/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Users,
  Settings,
  Bookmark,
  LayoutGrid,
  LucideIcon,
  Package,
  Image,
  ClipboardList,
  MessageSquareQuote,
  ShoppingBag,
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/admin/dashboard',
          label: 'Dashboard',
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Contents',
      menus: [
        {
          href: '/admin/products',
          label: 'Products',
          icon: Package,
        },
        {
          href: '/admin/product-images',
          label: 'Product Image',
          icon: Image,
          submenus: [],
        },
        {
          href: '/admin/categories',
          label: 'Categories',
          icon: Bookmark,
        },
        {
          href: '/admin/orders',
          label: 'Orders',
          icon: ClipboardList,
        },
        {
          href: '/admin/reviews',
          label: 'Reviews',
          icon: MessageSquareQuote,
        },
        {
          href: '/admin/carts',
          label: 'Carts',
          icon: ShoppingBag,
        },
      ],
    },
    {
      groupLabel: 'Settings',
      menus: [
        {
          href: '/admin/users',
          label: 'Users',
          icon: Users,
        },
      ],
    },
  ];
}
