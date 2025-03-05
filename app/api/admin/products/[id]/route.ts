import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

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
