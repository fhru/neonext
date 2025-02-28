/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getProducts } from '@/lib/data';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const data = await request.json();

    // Create the product using a transaction to ensure data consistency
    const product = await prisma.$transaction(async (tx) => {
      // 1. Create the base product
      const newProduct = await tx.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: new Decimal(data.price.toString()),
          stock: parseInt(data.stock),
          sku: data.sku || null,
          isActive: data.isActive !== undefined ? data.isActive : true,
        },
      });

      // 2. Create product images if any
      if (data.images && data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((url: string, index: number) => ({
            url,
            productId: newProduct.id,
            isMain: index === 0,
            alt: `${data.name} image ${index + 1}`,
          })),
        });
      }

      // 3. Create product-category relationships if any
      if (data.categories && data.categories.length > 0) {
        await tx.productCategory.createMany({
          data: data.categories.map((categoryId: string) => ({
            productId: newProduct.id,
            categoryId,
          })),
        });
      }

      // 4. Return the complete product with relationships
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

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A product with this SKU already exists' },
          { status: 409 },
        );
      }
    }

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
