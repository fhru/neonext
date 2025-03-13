/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

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

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;

    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 });
    }

    // Parse and validate request body
    const data = await req.json();

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return new NextResponse('Product not found', { status: 404 });
    }

    // Update product base information
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        isActive: data.isActive,
      },
    });

    // Handle categories (remove existing and add new ones)
    if (data.categories && data.categories.length > 0) {
      await prisma.productCategory.deleteMany({
        where: { productId },
      });

      await prisma.productCategory.createMany({
        data: data.categories.map((categoryId: string) => ({
          productId,
          categoryId,
        })),
      });
    }

    // Handle images (remove existing and add new ones)
    if (data.images && data.images.length > 0) {
      // Delete existing product images
      await prisma.productImage.deleteMany({
        where: { productId },
      });

      // Create new product images
      await prisma.productImage.createMany({
        data: data.images.map((url: string, index: number) => ({
          productId,
          url,
          alt: `${data.name} image ${index + 1}`,
        })),
      });
    }

    // Fetch the complete updated product with relationships
    const completeProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        images: true,
      },
    });

    return NextResponse.json(completeProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;

    console.log({ productId });

    const productExist = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExist) {
      return NextResponse.json({ message: 'Product Not Found' }, { status: 404 });
    }

    await prisma.cartItem.deleteMany({
      where: { productId },
    });

    await prisma.orderItem.deleteMany({
      where: { productId },
    });

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Product Deleted Successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error Deleting Product', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
