/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productCategory.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // Create Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: 'user_01',
        clerkId: 'clerk_user_01',
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_02',
        clerkId: 'clerk_user_02',
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_03',
        clerkId: 'clerk_user_03',
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_04',
        clerkId: 'clerk_user_04',
      },
    }),
    prisma.user.create({
      data: {
        id: 'user_05',
        clerkId: 'clerk_user_05',
      },
    }),
  ]);

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: 'category_01',
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
      },
    }),
    prisma.category.create({
      data: {
        id: 'category_02',
        name: 'Clothing',
        description: 'Apparel and fashion items',
      },
    }),
    prisma.category.create({
      data: {
        id: 'category_03',
        name: 'Home & Kitchen',
        description: 'Home appliances and kitchen accessories',
      },
    }),
    prisma.category.create({
      data: {
        id: 'category_04',
        name: 'Books',
        description: 'Books, ebooks, and audiobooks',
      },
    }),
    prisma.category.create({
      data: {
        id: 'category_05',
        name: 'Sports & Outdoors',
        description: 'Sport equipment and outdoor gear',
      },
    }),
    prisma.category.create({
      data: {
        id: 'category_06',
        name: 'Beauty',
        description: 'Beauty and personal care products',
      },
    }),
  ]);

  // Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        id: 'prod_01',
        name: 'Smartphone Pro Max',
        description:
          'Latest smartphone with advanced camera features, stunning display, and all-day battery life. Perfect for photographers and tech enthusiasts.',
        price: new Decimal(899.99),
        stock: 25,
        sku: 'PHONE-PRO-001',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod_02',
        name: 'Classic Cotton T-Shirt',
        description:
          'Premium quality cotton t-shirt with a comfortable fit. Available in multiple colors and sizes.',
        price: new Decimal(24.99),
        stock: 100,
        sku: 'TSHIRT-CTN-002',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod_03',
        name: 'Automatic Coffee Maker',
        description:
          'Programmable coffee maker with timer and temperature control. Brews up to 12 cups at once.',
        price: new Decimal(89.99),
        stock: 15,
        sku: 'COFFEE-AUT-003',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod_04',
        name: 'Bestseller Novel Collection',
        description: 'Set of 5 bestselling novels from top authors. Perfect gift for book lovers.',
        price: new Decimal(49.99),
        stock: 30,
        sku: 'BOOK-SET-004',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod_05',
        name: 'Pro Yoga Mat',
        description:
          'Non-slip, eco-friendly yoga mat with perfect cushioning for joints. Includes carrying strap.',
        price: new Decimal(39.99),
        stock: 50,
        sku: 'YOGA-MAT-005',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod_06',
        name: 'Wireless Noise-Cancelling Headphones',
        description:
          'Premium headphones with active noise cancellation, 30-hour battery life, and crystal clear sound.',
        price: new Decimal(199.99),
        stock: 10,
        sku: 'AUDIO-NCH-006',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod_07',
        name: 'Winter Insulated Jacket',
        description:
          'Waterproof, windproof jacket with thermal insulation. Perfect for winter sports and everyday wear.',
        price: new Decimal(129.99),
        stock: 35,
        sku: 'JACKET-WIN-007',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod_08',
        name: 'Smart Watch Series 5',
        description:
          'Track fitness, receive notifications, and more with this waterproof smartwatch with 7-day battery life.',
        price: new Decimal(249.99),
        stock: 20,
        sku: 'WATCH-SMT-008',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod_09',
        name: 'Natural Face Moisturizer',
        description:
          'Hydrating face cream with all-natural ingredients. Suitable for all skin types.',
        price: new Decimal(22.99),
        stock: 60,
        sku: 'BEAUTY-MST-009',
        isActive: true,
      },
    }),
    prisma.product.create({
      data: {
        id: 'prod_10',
        name: 'Professional Chef Knife Set',
        description: 'Set of 5 professional-grade stainless steel knives with ergonomic handles.',
        price: new Decimal(119.99),
        stock: 15,
        sku: 'KITCHEN-KNF-010',
        isActive: true,
      },
    }),
  ]);

  // Add product categories (many-to-many relationship)
  await Promise.all([
    // Smartphone in Electronics
    prisma.productCategory.create({
      data: {
        id: 'pc_01',
        productId: 'prod_01',
        categoryId: 'category_01',
      },
    }),
    // T-Shirt in Clothing
    prisma.productCategory.create({
      data: {
        id: 'pc_02',
        productId: 'prod_02',
        categoryId: 'category_02',
      },
    }),
    // Coffee Maker in Home & Kitchen
    prisma.productCategory.create({
      data: {
        id: 'pc_03',
        productId: 'prod_03',
        categoryId: 'category_03',
      },
    }),
    // Coffee Maker also in Electronics
    prisma.productCategory.create({
      data: {
        id: 'pc_04',
        productId: 'prod_03',
        categoryId: 'category_01',
      },
    }),
    // Novel Collection in Books
    prisma.productCategory.create({
      data: {
        id: 'pc_05',
        productId: 'prod_04',
        categoryId: 'category_04',
      },
    }),
    // Yoga Mat in Sports & Outdoors
    prisma.productCategory.create({
      data: {
        id: 'pc_06',
        productId: 'prod_05',
        categoryId: 'category_05',
      },
    }),
    // Headphones in Electronics
    prisma.productCategory.create({
      data: {
        id: 'pc_07',
        productId: 'prod_06',
        categoryId: 'category_01',
      },
    }),
    // Winter Jacket in Clothing
    prisma.productCategory.create({
      data: {
        id: 'pc_08',
        productId: 'prod_07',
        categoryId: 'category_02',
      },
    }),
    // Winter Jacket also in Sports & Outdoors
    prisma.productCategory.create({
      data: {
        id: 'pc_09',
        productId: 'prod_07',
        categoryId: 'category_05',
      },
    }),
    // Smartwatch in Electronics
    prisma.productCategory.create({
      data: {
        id: 'pc_10',
        productId: 'prod_08',
        categoryId: 'category_01',
      },
    }),
    // Smartwatch also in Sports & Outdoors
    prisma.productCategory.create({
      data: {
        id: 'pc_11',
        productId: 'prod_08',
        categoryId: 'category_05',
      },
    }),
    // Face Moisturizer in Beauty
    prisma.productCategory.create({
      data: {
        id: 'pc_12',
        productId: 'prod_09',
        categoryId: 'category_06',
      },
    }),
    // Chef Knife Set in Home & Kitchen
    prisma.productCategory.create({
      data: {
        id: 'pc_13',
        productId: 'prod_10',
        categoryId: 'category_03',
      },
    }),
  ]);

  // Add product images
  await Promise.all([
    // Smartphone images
    prisma.productImage.create({
      data: {
        id: 'img_01',
        url: 'https://example.com/images/smartphone-pro-max-1.jpg',
        alt: 'Smartphone Pro Max - Front view',
        isMain: true,
        productId: 'prod_01',
      },
    }),
    prisma.productImage.create({
      data: {
        id: 'img_02',
        url: 'https://example.com/images/smartphone-pro-max-2.jpg',
        alt: 'Smartphone Pro Max - Back view',
        isMain: false,
        productId: 'prod_01',
      },
    }),
    prisma.productImage.create({
      data: {
        id: 'img_03',
        url: 'https://example.com/images/smartphone-pro-max-3.jpg',
        alt: 'Smartphone Pro Max - Side view',
        isMain: false,
        productId: 'prod_01',
      },
    }),

    // T-Shirt images
    prisma.productImage.create({
      data: {
        id: 'img_04',
        url: 'https://example.com/images/tshirt-1.jpg',
        alt: 'Classic Cotton T-Shirt - Blue',
        isMain: true,
        productId: 'prod_02',
      },
    }),
    prisma.productImage.create({
      data: {
        id: 'img_05',
        url: 'https://example.com/images/tshirt-2.jpg',
        alt: 'Classic Cotton T-Shirt - Black',
        isMain: false,
        productId: 'prod_02',
      },
    }),

    // Coffee Maker images
    prisma.productImage.create({
      data: {
        id: 'img_06',
        url: 'https://example.com/images/coffee-maker-1.jpg',
        alt: 'Automatic Coffee Maker - Front',
        isMain: true,
        productId: 'prod_03',
      },
    }),
    prisma.productImage.create({
      data: {
        id: 'img_07',
        url: 'https://example.com/images/coffee-maker-2.jpg',
        alt: 'Automatic Coffee Maker - Side',
        isMain: false,
        productId: 'prod_03',
      },
    }),

    // Book Collection images
    prisma.productImage.create({
      data: {
        id: 'img_08',
        url: 'https://example.com/images/book-collection-1.jpg',
        alt: 'Bestseller Novel Collection',
        isMain: true,
        productId: 'prod_04',
      },
    }),

    // Yoga Mat images
    prisma.productImage.create({
      data: {
        id: 'img_09',
        url: 'https://example.com/images/yoga-mat-1.jpg',
        alt: 'Pro Yoga Mat - Purple',
        isMain: true,
        productId: 'prod_05',
      },
    }),
    prisma.productImage.create({
      data: {
        id: 'img_10',
        url: 'https://example.com/images/yoga-mat-2.jpg',
        alt: 'Pro Yoga Mat - Blue',
        isMain: false,
        productId: 'prod_05',
      },
    }),

    // Headphones images
    prisma.productImage.create({
      data: {
        id: 'img_11',
        url: 'https://example.com/images/headphones-1.jpg',
        alt: 'Wireless Noise-Cancelling Headphones - Black',
        isMain: true,
        productId: 'prod_06',
      },
    }),
    prisma.productImage.create({
      data: {
        id: 'img_12',
        url: 'https://example.com/images/headphones-2.jpg',
        alt: 'Wireless Noise-Cancelling Headphones - Silver',
        isMain: false,
        productId: 'prod_06',
      },
    }),

    // Winter Jacket images
    prisma.productImage.create({
      data: {
        id: 'img_13',
        url: 'https://example.com/images/winter-jacket-1.jpg',
        alt: 'Winter Insulated Jacket - Navy',
        isMain: true,
        productId: 'prod_07',
      },
    }),
    prisma.productImage.create({
      data: {
        id: 'img_14',
        url: 'https://example.com/images/winter-jacket-2.jpg',
        alt: 'Winter Insulated Jacket - Black',
        isMain: false,
        productId: 'prod_07',
      },
    }),

    // Smart Watch images
    prisma.productImage.create({
      data: {
        id: 'img_15',
        url: 'https://example.com/images/smart-watch-1.jpg',
        alt: 'Smart Watch Series 5 - Black',
        isMain: true,
        productId: 'prod_08',
      },
    }),
    prisma.productImage.create({
      data: {
        id: 'img_16',
        url: 'https://example.com/images/smart-watch-2.jpg',
        alt: 'Smart Watch Series 5 - Silver',
        isMain: false,
        productId: 'prod_08',
      },
    }),

    // Face Moisturizer images
    prisma.productImage.create({
      data: {
        id: 'img_17',
        url: 'https://example.com/images/face-moisturizer-1.jpg',
        alt: 'Natural Face Moisturizer',
        isMain: true,
        productId: 'prod_09',
      },
    }),

    // Chef Knife Set images
    prisma.productImage.create({
      data: {
        id: 'img_18',
        url: 'https://example.com/images/knife-set-1.jpg',
        alt: 'Professional Chef Knife Set',
        isMain: true,
        productId: 'prod_10',
      },
    }),
    prisma.productImage.create({
      data: {
        id: 'img_19',
        url: 'https://example.com/images/knife-set-2.jpg',
        alt: 'Professional Chef Knife Set - Individual Knives',
        isMain: false,
        productId: 'prod_10',
      },
    }),
  ]);

  // Create reviews
  await Promise.all([
    // Reviews for Smartphone
    prisma.review.create({
      data: {
        id: 'rev_01',
        rating: 5,
        comment: 'Incredible phone! The camera quality is amazing and battery lasts all day.',
        userId: 'user_01',
        productId: 'prod_01',
      },
    }),
    prisma.review.create({
      data: {
        id: 'rev_02',
        rating: 4,
        comment: 'Great phone overall. A bit expensive but worth it for the features.',
        userId: 'user_02',
        productId: 'prod_01',
      },
    }),

    // Reviews for T-Shirt
    prisma.review.create({
      data: {
        id: 'rev_03',
        rating: 5,
        comment: 'Very comfortable and fits perfectly. Will buy more in different colors!',
        userId: 'user_03',
        productId: 'prod_02',
      },
    }),

    // Reviews for Coffee Maker
    prisma.review.create({
      data: {
        id: 'rev_04',
        rating: 3,
        comment: 'Works well but difficult to clean. Makes good coffee though.',
        userId: 'user_04',
        productId: 'prod_03',
      },
    }),
    prisma.review.create({
      data: {
        id: 'rev_05',
        rating: 4,
        comment: 'Great coffee maker for the price. Timer feature is very helpful.',
        userId: 'user_05',
        productId: 'prod_03',
      },
    }),

    // Reviews for Book Collection
    prisma.review.create({
      data: {
        id: 'rev_06',
        rating: 5,
        comment: 'Excellent selection of books! Kept me entertained for weeks.',
        userId: 'user_01',
        productId: 'prod_04',
      },
    }),

    // Reviews for Yoga Mat
    prisma.review.create({
      data: {
        id: 'rev_07',
        rating: 4,
        comment: 'Good quality mat with nice cushioning. Non-slip as advertised.',
        userId: 'user_02',
        productId: 'prod_05',
      },
    }),

    // Reviews for Headphones
    prisma.review.create({
      data: {
        id: 'rev_08',
        rating: 5,
        comment: "Best headphones I've ever owned! Noise cancellation is perfect for my commute.",
        userId: 'user_03',
        productId: 'prod_06',
      },
    }),

    // Reviews for Winter Jacket
    prisma.review.create({
      data: {
        id: 'rev_09',
        rating: 4,
        comment: 'Very warm and comfortable. Withstood heavy snow and kept me dry.',
        userId: 'user_04',
        productId: 'prod_07',
      },
    }),

    // Reviews for Smart Watch
    prisma.review.create({
      data: {
        id: 'rev_10',
        rating: 3,
        comment: 'Good features but battery life is shorter than advertised.',
        userId: 'user_05',
        productId: 'prod_08',
      },
    }),
    prisma.review.create({
      data: {
        id: 'rev_11',
        rating: 5,
        comment: 'Love all the fitness tracking features! Very accurate and easy to use.',
        userId: 'user_01',
        productId: 'prod_08',
      },
    }),

    // Reviews for Face Moisturizer
    prisma.review.create({
      data: {
        id: 'rev_12',
        rating: 5,
        comment: 'Made my skin feel amazing! No irritation and absorbs quickly.',
        userId: 'user_02',
        productId: 'prod_09',
      },
    }),

    // Reviews for Chef Knife Set
    prisma.review.create({
      data: {
        id: 'rev_13',
        rating: 5,
        comment: 'Professional quality knives. Stay sharp and have a great balance.',
        userId: 'user_03',
        productId: 'prod_10',
      },
    }),
  ]);

  const carts = await Promise.all([
    prisma.cart.create({
      data: {
        id: 'cart_01',
        userId: 'user_01',
      },
    }),
    prisma.cart.create({
      data: {
        id: 'cart_02',
        userId: 'user_02',
      },
    }),
    prisma.cart.create({
      data: {
        id: 'cart_03',
        userId: 'user_03',
      },
    }),
  ]);

  // Add items to carts
  await Promise.all([
    // Items in user_01's cart
    prisma.cartItem.create({
      data: {
        id: 'ci_01',
        cartId: 'cart_01',
        productId: 'prod_06', // Headphones
        quantity: 1,
      },
    }),
    prisma.cartItem.create({
      data: {
        id: 'ci_02',
        cartId: 'cart_01',
        productId: 'prod_10', // Chef Knife Set
        quantity: 1,
      },
    }),

    // Items in user_02's cart
    prisma.cartItem.create({
      data: {
        id: 'ci_03',
        cartId: 'cart_02',
        productId: 'prod_01', // Smartphone
        quantity: 1,
      },
    }),
    prisma.cartItem.create({
      data: {
        id: 'ci_04',
        cartId: 'cart_02',
        productId: 'prod_02', // T-Shirt
        quantity: 2,
      },
    }),
    prisma.cartItem.create({
      data: {
        id: 'ci_05',
        cartId: 'cart_02',
        productId: 'prod_09', // Face Moisturizer
        quantity: 1,
      },
    }),

    // Items in user_03's cart
    prisma.cartItem.create({
      data: {
        id: 'ci_06',
        cartId: 'cart_03',
        productId: 'prod_05', // Yoga Mat
        quantity: 1,
      },
    }),
  ]);

  // Create orders
  await Promise.all([
    // Completed order for user_01
    prisma.order.create({
      data: {
        id: 'order_01',
        orderNumber: 'ORD-2025-001',
        userId: 'user_01',
        totalAmount: new Decimal(389.97),
        status: 'DELIVERED',
        paymentStatus: 'PAID',
        shippingAddress: '123 Main St, Apt 4B, New York, NY 10001',
        billingAddress: '123 Main St, Apt 4B, New York, NY 10001',
        paymentMethod: 'Credit Card',
        trackingNumber: 'TRK12345678',
        notes: 'Please leave package at the door',
        items: {
          create: [
            {
              id: 'oi_01',
              productId: 'prod_03', // Coffee Maker
              quantity: 1,
              priceAtTime: new Decimal(89.99),
            },
            {
              id: 'oi_02',
              productId: 'prod_08', // Smart Watch
              quantity: 1,
              priceAtTime: new Decimal(249.99),
            },
            {
              id: 'oi_03',
              productId: 'prod_09', // Face Moisturizer
              quantity: 2,
              priceAtTime: new Decimal(24.99),
            },
          ],
        },
      },
    }),

    // Processing order for user_02
    prisma.order.create({
      data: {
        id: 'order_02',
        orderNumber: 'ORD-2025-002',
        userId: 'user_02',
        totalAmount: new Decimal(279.98),
        status: 'PROCESSING',
        paymentStatus: 'PAID',
        shippingAddress: '456 Oak Ave, Chicago, IL 60601',
        billingAddress: '456 Oak Ave, Chicago, IL 60601',
        paymentMethod: 'PayPal',
        items: {
          create: [
            {
              id: 'oi_04',
              productId: 'prod_06', // Headphones
              quantity: 1,
              priceAtTime: new Decimal(199.99),
            },
            {
              id: 'oi_05',
              productId: 'prod_04', // Book Collection
              quantity: 1,
              priceAtTime: new Decimal(49.99),
            },
            {
              id: 'oi_06',
              productId: 'prod_02', // T-Shirt
              quantity: 1,
              priceAtTime: new Decimal(29.99),
            },
          ],
        },
      },
    }),

    // Cancelled order for user_03
    prisma.order.create({
      data: {
        id: 'order_03',
        orderNumber: 'ORD-2025-003',
        userId: 'user_03',
        totalAmount: new Decimal(899.99),
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED',
        shippingAddress: '789 Pine St, San Francisco, CA 94105',
        billingAddress: '789 Pine St, San Francisco, CA 94105',
        paymentMethod: 'Credit Card',
        notes: 'Order cancelled by customer',
        items: {
          create: [
            {
              id: 'oi_07',
              productId: 'prod_01', // Smartphone
              quantity: 1,
              priceAtTime: new Decimal(899.99),
            },
          ],
        },
      },
    }),

    // Pending order for user_04
    prisma.order.create({
      data: {
        id: 'order_04',
        orderNumber: 'ORD-2025-004',
        userId: 'user_04',
        totalAmount: new Decimal(169.98),
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        shippingAddress: '101 Maple Rd, Austin, TX 78701',
        billingAddress: '101 Maple Rd, Austin, TX 78701',
        paymentMethod: 'Credit Card',
        items: {
          create: [
            {
              id: 'oi_08',
              productId: 'prod_07', // Winter Jacket
              quantity: 1,
              priceAtTime: new Decimal(129.99),
            },
            {
              id: 'oi_09',
              productId: 'prod_09', // Face Moisturizer
              quantity: 1,
              priceAtTime: new Decimal(22.99),
            },
            {
              id: 'oi_10',
              productId: 'prod_02', // T-Shirt
              quantity: 1,
              priceAtTime: new Decimal(24.99),
            },
          ],
        },
      },
    }),

    // Shipped order for user_05
    prisma.order.create({
      data: {
        id: 'order_05',
        orderNumber: 'ORD-2025-005',
        userId: 'user_05',
        totalAmount: new Decimal(389.96),
        status: 'SHIPPED',
        paymentStatus: 'PAID',
        shippingAddress: '222 Cedar Blvd, Seattle, WA 98101',
        billingAddress: '222 Cedar Blvd, Seattle, WA 98101',
        paymentMethod: 'Credit Card',
        trackingNumber: 'TRK87654321',
        items: {
          create: [
            {
              id: 'oi_11',
              productId: 'prod_10', // Chef Knife Set
              quantity: 1,
              priceAtTime: new Decimal(119.99),
            },
            {
              id: 'oi_12',
              productId: 'prod_08', // Smart Watch
              quantity: 1,
              priceAtTime: new Decimal(249.99),
            },
            {
              id: 'oi_13',
              productId: 'prod_05', // Yoga Mat
              quantity: 1,
              priceAtTime: new Decimal(39.99),
            },
          ],
        },
      },
    }),
  ]);

  console.log('Database has been seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
