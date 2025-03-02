import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        images: true,
      },
    });

    if (!product) return NextResponse.json({ error: 'Product Not Found' }, { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;
    const data = await request.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        categories: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update the product using a transaction to ensure data consistency
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Update the base product
      const product = await tx.product.update({
        where: { id: productId },
        data: {
          name: data.name !== undefined ? data.name : undefined,
          description: data.description !== undefined ? data.description : undefined,
          price: data.price !== undefined ? Decimal(data.price.toString()) : undefined,
          stock: data.stock !== undefined ? parseInt(data.stock) : undefined,
          sku: data.sku !== undefined ? data.sku : undefined,
          isActive: data.isActive !== undefined ? data.isActive : undefined,
        },
      });

      // 2. Handle product images if provided
      if (data.images !== undefined) {
        // Delete existing images
        await tx.productImage.deleteMany({
          where: { productId },
        });

        // Create new images if any
        if (data.images && data.images.length > 0) {
          await tx.productImage.createMany({
            data: data.images.map((img: { url: string }, index: number) => ({
              url: img.url,
              productId,
              isMain: index === 0,
              alt: `${product.name} image ${index + 1}`,
            })),
          });
        }
      }

      // 3. Handle product-category relationships if provided
      if (data.categories !== undefined) {
        // Delete existing category relationships
        await tx.productCategory.deleteMany({
          where: { productId },
        });

        // Create new category relationships if any
        if (data.categories && data.categories.length > 0) {
          await tx.productCategory.createMany({
            data: data.categories.map((categoryId: string) => ({
              productId,
              categoryId,
            })),
          });
        }
      }

      // 4. Return the updated product with relationships
      return tx.product.findUnique({
        where: { id: productId },
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

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: 'A product with this SKU already exists' },
          { status: 409 },
        );
      }
    }

    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
