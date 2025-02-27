import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalUsers = await prisma.user.count();
    const totalProducts = await prisma.product.count();
    const totalCategories = await prisma.category.count();
    const totalOrders = await prisma.order.count();

    return NextResponse.json({
      users: totalUsers,
      products: totalProducts,
      categories: totalCategories,
      orders: totalOrders,
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
