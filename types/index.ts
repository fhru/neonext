import { Decimal } from '@prisma/client/runtime/library';

export interface Images {
  id: string;
  url: string;
  alt: string;
  isMain: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface ProductCategory {
  productId: string;
  categoryId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: Decimal;
  stock: number;
  createdAt: Date;
  isActive: boolean;
  images: Array<{
    id: string;
    url: string;
    alt: string;
  }>;
  categories: Array<{
    category: {
      id: string;
      name: string;
    };
  }>;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  file?: File;
}
