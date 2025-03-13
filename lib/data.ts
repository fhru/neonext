import { prisma } from '@/lib/prisma';

export async function getProducts() {
  const products = await prisma.product.findMany({
    include: {
      images: true,
      categories: {
        include: {
          category: true,
        },
      },
      reviews: {
        include: {
          user: true,
        },
      },
    },
  });

  return products;
}

export async function getProductById(productId: string) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
      categories: {
        include: {
          category: true,
        },
      },
      reviews: {
        include: {
          user: true,
        },
      },
    },
  });

  return product;
}
