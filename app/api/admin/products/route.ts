/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProducts } from '@/lib/data';
import { Decimal } from '@prisma/client/runtime/library';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: Decimal(data.price.toString()),
          stock: parseInt(data.stock),
          isActive: data.isActive !== undefined ? data.isActive : true,
        },
      });

      if (data.images && data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((url: string, index: number) => ({
            url,
            productId: newProduct.id,
            alt: `${data.name} image ${index + 1}`,
          })),
        });
      }

      if (data.categories && data.categories.length > 0) {
        await tx.productCategory.createMany({
          data: data.categories.map((categoryId: string) => ({
            productId: newProduct.id,
            categoryId,
          })),
        });
      }

      return tx.product.findUnique({
        where: { id: newProduct.id },
        include: {
          images: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      });
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch Products' }, { status: 500 });
  }
}
