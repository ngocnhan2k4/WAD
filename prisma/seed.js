const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function main(){

    //Thứ tự tạo DB: Admin - User - Categories - Suppliers - Products - UserCart - Reviews - Image - Orders - OrderDetail - Payment
    //Xem database: npx prisma studio
    await prisma.admin.createMany({
        data:[

        ]
    }),

    await prisma.user.createMany({
        data: [
            { username: 'alice01', password: 'securepass123' },
            { username: 'bob_the_builder', password: 'builder456' },
            { username: 'charlie_mk', password: 'charlie789' },
            { username: 'dave92', password: 'davesecret' },
            { username: 'ellen_w', password: 'password123' },
            { username: 'frankie_l', password: 'frankiepass' },
            { username: 'gina_g', password: 'ginapw123' },
            { username: 'harry.h', password: 'harry456' },
            { username: 'irene90', password: 'irene789' },
            { username: 'jackson_t', password: 'jackpw123' }
        ]
    });

    await prisma.user.createMany({
        data:[
            {username:'nhansensei',password:'secret'},
            {username:'nhansensei1',password:'secret'},
        ]
    })
    
    await prisma.categories.createMany({
        data: [
            { category_name: 'Office Furniture' },
            { category_name: 'Home Furniture' },
            { category_name: 'Storage Solutions' },
            { category_name: 'Lighting' },
            { category_name: 'Décor' },
            { category_name: 'Kitchen Supplies' },
            { category_name: 'Bathroom Essentials' },
            { category_name: 'Outdoor Furniture' },
            { category_name: 'Organization Tools' },
            { category_name: 'Electronics' }
        ]
    });    

    await prisma.suppliers.createMany({
        data: [
            { brand: 'FurnitureCo' },
            { brand: 'OfficePro' },
            { brand: 'HomeEssentials' },
            { brand: 'LightItUp' },
            { brand: 'DecorWorld' },
            { brand: 'KitchenMasters' },
            { brand: 'BathBasics' },
            { brand: 'OutdoorLiving' },
            { brand: 'OrganizeIt' },
            { brand: 'TechGear' }
        ]
    });

    await prisma.product.createMany({
        data: [
            { product_name: 'Office Desk', category_id: 1, manufacturer: 1, original_price: 150.00, current_price: 135.00, creation_time: new Date(), description: 'Sturdy office desk with ample storage', stock_quantity: 50, total_purchase: 20 },
            { product_name: 'Ergonomic Chair', category_id: 1, manufacturer: 2, original_price: 200.00, current_price: 180.00, creation_time: new Date(), description: 'Comfortable ergonomic chair for long hours', stock_quantity: 75, total_purchase: 30 },
            { product_name: 'Standing Desk', category_id: 1, manufacturer: 1, original_price: 250.00, current_price: 225.00, creation_time: new Date(), description: 'Adjustable standing desk', stock_quantity: 40, total_purchase: 15 },
            { product_name: 'File Cabinet', category_id: 2, manufacturer: 3, original_price: 100.00, current_price: 95.00, creation_time: new Date(), description: 'Lockable file cabinet', stock_quantity: 60, total_purchase: 25 },
            { product_name: 'Bookshelf', category_id: 2, manufacturer: 4, original_price: 120.00, current_price: 110.00, creation_time: new Date(), description: 'Wooden bookshelf with 5 shelves', stock_quantity: 40, total_purchase: 18 },
            { product_name: 'Office Lamp', category_id: 1, manufacturer: 5, original_price: 50.00, current_price: 45.00, creation_time: new Date(), description: 'Adjustable LED desk lamp', stock_quantity: 100, total_purchase: 40 },
            { product_name: 'Coffee Table', category_id: 3, manufacturer: 4, original_price: 80.00, current_price: 70.00, creation_time: new Date(), description: 'Modern coffee table', stock_quantity: 30, total_purchase: 12 },
            { product_name: 'Sofa Set', category_id: 3, manufacturer: 6, original_price: 600.00, current_price: 550.00, creation_time: new Date(), description: 'Comfortable sofa set for living room', stock_quantity: 20, total_purchase: 8 },
            { product_name: 'Dining Table', category_id: 3, manufacturer: 7, original_price: 400.00, current_price: 375.00, creation_time: new Date(), description: 'Elegant dining table set', stock_quantity: 15, total_purchase: 10 },
            { product_name: 'Office Partition', category_id: 1, manufacturer: 8, original_price: 220.00, current_price: 210.00, creation_time: new Date(), description: 'Modular office partition', stock_quantity: 25, total_purchase: 13 },
            { product_name: 'Whiteboard', category_id: 1, manufacturer: 9, original_price: 60.00, current_price: 55.00, creation_time: new Date(), description: 'Large whiteboard for meetings', stock_quantity: 80, total_purchase: 45 },
            { product_name: 'Storage Cabinet', category_id: 2, manufacturer: 4, original_price: 180.00, current_price: 160.00, creation_time: new Date(), description: 'Spacious storage cabinet', stock_quantity: 30, total_purchase: 10 },
            { product_name: 'Office Couch', category_id: 1, manufacturer: 6, original_price: 400.00, current_price: 380.00, creation_time: new Date(), description: 'Stylish office couch', stock_quantity: 10, total_purchase: 5 },
            { product_name: 'Conference Table', category_id: 1, manufacturer: 7, original_price: 700.00, current_price: 650.00, creation_time: new Date(), description: 'Large conference table for meetings', stock_quantity: 5, total_purchase: 3 },
            { product_name: 'Drawer Chest', category_id: 3, manufacturer: 4, original_price: 150.00, current_price: 140.00, creation_time: new Date(), description: 'Wooden drawer chest for bedrooms', stock_quantity: 25, total_purchase: 12 },
            { product_name: 'Nightstand', category_id: 3, manufacturer: 4, original_price: 80.00, current_price: 75.00, creation_time: new Date(), description: 'Compact nightstand with drawers', stock_quantity: 40, total_purchase: 20 },
            { product_name: 'Bar Stool', category_id: 3, manufacturer: 5, original_price: 50.00, current_price: 45.00, creation_time: new Date(), description: 'Modern bar stool', stock_quantity: 35, total_purchase: 18 },
            { product_name: 'Office Printer', category_id: 1, manufacturer: 9, original_price: 250.00, current_price: 240.00, creation_time: new Date(), description: 'Multifunction office printer', stock_quantity: 30, total_purchase: 12 },
            { product_name: 'File Organizer', category_id: 2, manufacturer: 3, original_price: 25.00, current_price: 20.00, creation_time: new Date(), description: 'Desk file organizer', stock_quantity: 100, total_purchase: 40 },
            { product_name: 'Wall Clock', category_id: 2, manufacturer: 5, original_price: 30.00, current_price: 28.00, creation_time: new Date(), description: 'Simple wall clock', stock_quantity: 90, total_purchase: 60 }
        ]
    });

    await prisma.userCart.createMany({
        data: [

            { user_id: 1, product_id: 1, quantity: 2, price: 135.00 }, // Office Desk
            { user_id: 1, product_id: 3, quantity: 1, price: 225.00 }, // Standing Desk

            { user_id: 2, product_id: 5, quantity: 3, price: 110.00 }, // Bookshelf
            { user_id: 2, product_id: 6, quantity: 1, price: 45.00 }, // Office Lamp

            { user_id: 3, product_id: 8, quantity: 2, price: 550.00 }, // Sofa Set
            { user_id: 3, product_id: 10, quantity: 1, price: 650.00 }, // Conference Table

            { user_id: 4, product_id: 12, quantity: 2, price: 140.00 }, // Drawer Chest
            { user_id: 4, product_id: 13, quantity: 1, price: 75.00 }, // Nightstand

            { user_id: 5, product_id: 15, quantity: 1, price: 240.00 }, // Office Printer
            { user_id: 5, product_id: 17, quantity: 2, price: 28.00 }, // Wall Clock

            { user_id: 6, product_id: 9, quantity: 1, price: 550.00 }, // Dining Table
            { user_id: 6, product_id: 2, quantity: 3, price: 180.00 }, // Ergonomic Chair
        ]
    });
    
    await prisma.reviews.createMany({
        data: [
            { ordinal_numbers: 1, product_id: 1, review_detail: 'Great desk, very sturdy and spacious.' },

            { ordinal_numbers: 1, product_id: 2, review_detail: 'Comfortable for long hours of work, highly recommended.' },
            { ordinal_numbers: 2, product_id: 2, review_detail: 'Good chair, but the lumbar support could be better.' },

            { ordinal_numbers: 1, product_id: 3, review_detail: 'The height adjustment works well, but could be more stable.' },
            
            { ordinal_numbers: 1, product_id: 4, review_detail: 'Perfect size for my home office, very secure.' },
            { ordinal_numbers: 2, product_id: 4, review_detail: 'Good quality, but I wish the drawers were larger.' },

            { ordinal_numbers: 1, product_id: 5, review_detail: 'Beautiful bookshelf, fits well in my living room.' },
            { ordinal_numbers: 2, product_id: 5, review_detail: 'Nice design, but some of the assembly parts didn’t fit well.' },

            { ordinal_numbers: 1, product_id: 6, review_detail: 'Love the modern design, very sturdy.' },

            { ordinal_numbers: 1, product_id: 7, review_detail: 'Comfortable and stylish, perfect for the living room.' },
            { ordinal_numbers: 2, product_id: 7, review_detail: 'Great sofa, but a little firm for my liking.' },

            { ordinal_numbers: 1, product_id: 8, review_detail: 'Elegant dining table, looks fantastic in my kitchen.' },
        ]
    });

    await prisma.images.createMany({
        data: [
            { ordinal_numbers: 1, product_id: 1, directory_path: '/images/products/product1.jpg' },
            { ordinal_numbers: 2, product_id: 1, directory_path: '/images/products/product2.jpg' },
            { ordinal_numbers: 3, product_id: 1, directory_path: '/images/products/product3.jpg' },
            { ordinal_numbers: 4, product_id: 1, directory_path: '/images/products/product4.jpg' },
            { ordinal_numbers: 5, product_id: 1, directory_path: '/images/products/product5.jpg' },
            { ordinal_numbers: 6, product_id: 1, directory_path: '/images/products/product6.jpg' },

            { ordinal_numbers: 1, product_id: 2, directory_path: '/images/products/product2.jpg' },
            { ordinal_numbers: 2, product_id: 2, directory_path: '/images/products/product3.jpg' },
            { ordinal_numbers: 3, product_id: 2, directory_path: '/images/products/product4.jpg' },
            { ordinal_numbers: 4, product_id: 2, directory_path: '/images/products/product5.jpg' },
            { ordinal_numbers: 5, product_id: 2, directory_path: '/images/products/product6.jpg' },
            { ordinal_numbers: 6, product_id: 2, directory_path: '/images/products/product7.jpg' },

            { ordinal_numbers: 1, product_id: 3, directory_path: '/images/products/product3.jpg' },
            { ordinal_numbers: 2, product_id: 3, directory_path: '/images/products/product4.jpg' },
            { ordinal_numbers: 3, product_id: 3, directory_path: '/images/products/product5.jpg' },
            { ordinal_numbers: 4, product_id: 3, directory_path: '/images/products/product6.jpg' },
            { ordinal_numbers: 5, product_id: 3, directory_path: '/images/products/product7.jpg' },
            { ordinal_numbers: 6, product_id: 3, directory_path: '/images/products/product8.jpg' },

            { ordinal_numbers: 1, product_id: 4, directory_path: '/images/products/product4.jpg' },
            { ordinal_numbers: 2, product_id: 4, directory_path: '/images/products/product5.jpg' },
            { ordinal_numbers: 3, product_id: 4, directory_path: '/images/products/product6.jpg' },
            { ordinal_numbers: 4, product_id: 4, directory_path: '/images/products/product7.jpg' },
            { ordinal_numbers: 5, product_id: 4, directory_path: '/images/products/product8.jpg' },
            { ordinal_numbers: 6, product_id: 4, directory_path: '/images/products/product9.jpg' },

            { ordinal_numbers: 1, product_id: 5, directory_path: '/images/products/product5.jpg' },
            { ordinal_numbers: 2, product_id: 5, directory_path: '/images/products/product6.jpg' },
            { ordinal_numbers: 3, product_id: 5, directory_path: '/images/products/product7.jpg' },
            { ordinal_numbers: 4, product_id: 5, directory_path: '/images/products/product8.jpg' },
            { ordinal_numbers: 5, product_id: 5, directory_path: '/images/products/product9.jpg' },
            { ordinal_numbers: 6, product_id: 5, directory_path: '/images/products/product10.jpg' },

            { ordinal_numbers: 1, product_id: 6, directory_path: '/images/products/product6.jpg' },
            { ordinal_numbers: 2, product_id: 6, directory_path: '/images/products/product7.jpg' },
            { ordinal_numbers: 3, product_id: 6, directory_path: '/images/products/product8.jpg' },
            { ordinal_numbers: 4, product_id: 6, directory_path: '/images/products/product9.jpg' },
            { ordinal_numbers: 5, product_id: 6, directory_path: '/images/products/product10.jpg' },
            { ordinal_numbers: 6, product_id: 6, directory_path: '/images/products/product11.jpg' },

            { ordinal_numbers: 1, product_id: 7, directory_path: '/images/products/product7.jpg' },
            { ordinal_numbers: 2, product_id: 7, directory_path: '/images/products/product8.jpg' },
            { ordinal_numbers: 3, product_id: 7, directory_path: '/images/products/product9.jpg' },
            { ordinal_numbers: 4, product_id: 7, directory_path: '/images/products/product10.jpg' },
            { ordinal_numbers: 5, product_id: 7, directory_path: '/images/products/product11.jpg' },
            { ordinal_numbers: 6, product_id: 7, directory_path: '/images/products/product12.jpg' },

            { ordinal_numbers: 1, product_id: 8, directory_path: '/images/products/product8.jpg' },
            { ordinal_numbers: 2, product_id: 8, directory_path: '/images/products/product9.jpg' },
            { ordinal_numbers: 3, product_id: 8, directory_path: '/images/products/product10.jpg' },
            { ordinal_numbers: 4, product_id: 8, directory_path: '/images/products/product11.jpg' },
            { ordinal_numbers: 5, product_id: 8, directory_path: '/images/products/product12.jpg' },
            { ordinal_numbers: 6, product_id: 8, directory_path: '/images/products/product1.jpg' },

            { ordinal_numbers: 1, product_id: 9, directory_path: '/images/products/product9.jpg' },
            { ordinal_numbers: 2, product_id: 9, directory_path: '/images/products/product10.jpg' },
            { ordinal_numbers: 3, product_id: 9, directory_path: '/images/products/product11.jpg' },
            { ordinal_numbers: 4, product_id: 9, directory_path: '/images/products/product12.jpg' },
            { ordinal_numbers: 5, product_id: 9, directory_path: '/images/products/product1.jpg' },
            { ordinal_numbers: 6, product_id: 9, directory_path: '/images/products/product2.jpg' },

            { ordinal_numbers: 1, product_id: 10, directory_path: '/images/products/product10.jpg' },
            { ordinal_numbers: 2, product_id: 10, directory_path: '/images/products/product11.jpg' },
            { ordinal_numbers: 3, product_id: 10, directory_path: '/images/products/product12.jpg' },
            { ordinal_numbers: 4, product_id: 10, directory_path: '/images/products/product1.jpg' },
            { ordinal_numbers: 5, product_id: 10, directory_path: '/images/products/product2.jpg' },
            { ordinal_numbers: 6, product_id: 10, directory_path: '/images/products/product3.jpg' }
        ]
    });

    await prisma.orders.createMany({
        data: [
            { user_id: 1, order_date: new Date('2024-01-05'), total_amount: 150.00, status: 'Completed', creation_time: new Date() },
            { user_id: 2, order_date: new Date('2024-02-10'), total_amount: 200.00, status: 'Processing', creation_time: new Date() },
            { user_id: 3, order_date: new Date('2024-03-15'), total_amount: 250.00, status: 'Pending', creation_time: new Date() },
            { user_id: 4, order_date: new Date('2024-04-20'), total_amount: 300.00, status: 'Completed', creation_time: new Date() },
            { user_id: 5, order_date: new Date('2024-05-25'), total_amount: 350.00, status: 'Cancelled', creation_time: new Date() },
            { user_id: 6, order_date: new Date('2024-06-30'), total_amount: 400.00, status: 'Completed', creation_time: new Date() },
            { user_id: 7, order_date: new Date('2024-07-05'), total_amount: 450.00, status: 'Shipped', creation_time: new Date() },
            { user_id: 8, order_date: new Date('2024-08-10'), total_amount: 500.00, status: 'Pending', creation_time: new Date() },
            { user_id: 9, order_date: new Date('2024-09-15'), total_amount: 550.00, status: 'Processing', creation_time: new Date() },
            { user_id: 10, order_date: new Date('2024-10-20'), total_amount: 600.00, status: 'Completed', creation_time: new Date() }
        ]
    });

    await prisma.orderDetail.createMany({
        data: [
            { order_id: 1, product_id: 1, quantity: 2, price: 75.00 },
            { order_id: 1, product_id: 2, quantity: 1, price: 75.00 },
            { order_id: 2, product_id: 3, quantity: 1, price: 200.00 },
            { order_id: 2, product_id: 4, quantity: 2, price: 100.00 },
            { order_id: 3, product_id: 5, quantity: 1, price: 250.00 },
            { order_id: 4, product_id: 6, quantity: 3, price: 100.00 },
            { order_id: 5, product_id: 7, quantity: 2, price: 175.00 },
            { order_id: 6, product_id: 8, quantity: 4, price: 100.00 },
            { order_id: 7, product_id: 9, quantity: 1, price: 450.00 },
            { order_id: 8, product_id: 10, quantity: 1, price: 500.00 },
            { order_id: 9, product_id: 1, quantity: 2, price: 275.00 },
            { order_id: 10, product_id: 2, quantity: 3, price: 200.00 },
            { order_id: 10, product_id: 5, quantity: 1, price: 100.00 }
        ]
    });

    await prisma.payments.createMany({
        data: [
            { order_id: 1, payment_date: new Date('2024-11-01T10:00:00Z'), amount: 150.00, payment_method: 'Momo' },
            { order_id: 2, payment_date: new Date('2024-11-02T12:30:00Z'), amount: 400.00, payment_method: 'VNPay' },
            { order_id: 3, payment_date: new Date('2024-11-03T15:45:00Z'), amount: 250.00, payment_method: 'PayPal' },
            { order_id: 4, payment_date: new Date('2024-11-04T09:20:00Z'), amount: 300.00, payment_method: 'Momo' },
            { order_id: 5, payment_date: new Date('2024-11-05T14:10:00Z'), amount: 350.00, payment_method: 'VNPay' },
            { order_id: 6, payment_date: new Date('2024-11-06T11:50:00Z'), amount: 400.00, payment_method: 'PayPal' },
            { order_id: 7, payment_date: new Date('2024-11-07T08:30:00Z'), amount: 175.00, payment_method: 'Momo' },
            { order_id: 8, payment_date: new Date('2024-11-08T16:40:00Z'), amount: 500.00, payment_method: 'VNPay' },
            { order_id: 9, payment_date: new Date('2024-11-09T13:25:00Z'), amount: 275.00, payment_method: 'PayPal' },
            { order_id: 10, payment_date: new Date('2024-11-10T10:00:00Z'), amount: 600.00, payment_method: 'Momo' }
        ]
    });
}


main()
    .catch((e) =>{
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });   