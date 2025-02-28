/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
// import { getProducts } from '@/lib/data';
// import { Decimal } from '@prisma/client/runtime/library';

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();

//     const {
//       name,
//       description,
//       price,
//       stock,
//       isActive = true,
//       categoryIds = [],
//       images = [],
//     } = body;

//     const newProduct = await prisma.$transaction(async (tx) => {
//       const product = await tx.product.create({
//         data: {
//           name,
//           description,
//           price: Decimal(price),
//           stock: stock || 0,
//           isActive,
//         },
//       });

//       if (categoryIds.length > 0) {
//         await Promise.all(
//           categoryIds.map((categoryId: any) =>
//             tx.productCategory.create({
//               data: {
//                 productId: product.id,
//                 categoryId,
//               },
//             }),
//           ),
//         );
//       }

//       if (images.length > 0) {
//         await Promise.all(
//           images.map((image: any) =>
//             tx.productImage.create({
//               data: {
//                 url: image.url,
//                 alt: image.alt || null,
//                 isMain: image.isMain || false,
//                 productId: product.id,
//               },
//             }),
//           ),
//         );
//       }

//       return tx.product.findUnique({
//         where: { id: product.id },
//         include: {
//           images: true,
//           categories: {
//             include: {
//               category: true,
//             },
//           },
//         },
//       });
//     });

//     return NextResponse.json(newProduct, { status: 201 });
//   } catch (error) {
//     console.error('Kesalahan saat membuat produk:', error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: 'Terjadi kesalahan saat membuat produk',
//         error: error instanceof Error ? error.message : 'Unknown error',
//       },
//       { status: 500 },
//     );
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const nameSortOrder = searchParams.get('name') || undefined;
    const dateSortOrder = searchParams.get('date') || undefined;

    const categories = await prisma.category.findMany({
      orderBy: [
        { name: nameSortOrder as 'asc' | 'desc' | undefined },
        { createdAt: dateSortOrder as 'asc' | 'desc' | undefined },
      ],
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
