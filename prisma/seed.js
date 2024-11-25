const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function main(){

    //Thứ tự tạo DB: User - Categories - Suppliers - Products - UserCart - Reviews - Image - Orders - OrderDetail - Payment
    //Xem database: npx prisma studio

    await prisma.user.createMany({
        data: [
            { username: 'alice01', password: 'securepass123', fullName: 'Alice Wonderland' },
            { username: 'bob_the_builder', password: 'builder456', fullName: 'Bob Builder' },
            { username: 'charlie_mk', password: 'charlie789', fullName: 'Charlie MK' },
            { username: 'dave92', password: 'davesecret', fullName: 'Dave Secret' },
            { username: 'ellen_w', password: 'password123', fullName: 'Ellen White' },
            { username: 'frankie_l', password: 'frankiepass', fullName: 'Frankie L' },
            { username: 'gina_g', password: 'ginapw123', fullName: 'Gina Green' },
            { username: 'harry.h', password: 'harry456', fullName: 'Harry Hill' },
            { username: 'irene90', password: 'irene789', fullName: 'Irene 90' },
            { username: 'jackson_t', password: 'jackpw123', fullName: 'Jackson T' },
            { username: 'katherine_x', password: 'kathy456', fullName: 'Katherine X' },
            { username: 'luis_m', password: 'luispass123', fullName: 'Luis M' },
            { username: 'michael_s', password: 'mike123456', fullName: 'Michael S' },
            { username: 'nina_b', password: 'ninapass789', fullName: 'Nina B' },
            { username: 'olivia_w', password: 'olivia2023', fullName: 'Olivia W' },
            { username: 'peter_j', password: 'peterpassword', fullName: 'Peter J' },
            { username: 'quinn_l', password: 'quinnpass12', fullName: 'Quinn L' },
            { username: 'rebecca_r', password: 'rebecca123', fullName: 'Rebecca R' },
            { username: 'steven_k', password: 'steven12345', fullName: 'Steven K' },
            { username: 'tina_m', password: 'tinamk2024', fullName: 'Tina M' }
        ]
    });
    
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
            // Product 1
            { ordinal_numbers: 1, product_id: 1, user_id: 1, review_detail: 'Amazing product, very durable.', creation_time: new Date('2024-11-01T08:00:00Z') },
            { ordinal_numbers: 2, product_id: 1, user_id: 2, review_detail: 'Highly recommend for office use.', creation_time: new Date('2024-11-02T09:00:00Z') },
            { ordinal_numbers: 3, product_id: 1, user_id: 3, review_detail: 'Great value for the price.', creation_time: new Date('2024-11-03T10:00:00Z') },
            { ordinal_numbers: 4, product_id: 1, user_id: 4, review_detail: 'Perfect size for my room.', creation_time: new Date('2024-11-04T11:00:00Z') },
        
            // Product 2
            { ordinal_numbers: 1, product_id: 2, user_id: 5, review_detail: 'Comfortable and easy to assemble.', creation_time: new Date('2024-11-05T08:00:00Z') },
            { ordinal_numbers: 2, product_id: 2, user_id: 6, review_detail: 'Good build quality, works as expected.', creation_time: new Date('2024-11-06T09:00:00Z') },
            { ordinal_numbers: 3, product_id: 2, user_id: 7, review_detail: 'Stylish design, fits perfectly in my room.', creation_time: new Date('2024-11-07T10:00:00Z') },
            { ordinal_numbers: 4, product_id: 2, user_id: 8, review_detail: 'High-quality materials, very sturdy.', creation_time: new Date('2024-11-08T11:00:00Z') },
        
            // Product 3
            { ordinal_numbers: 1, product_id: 3, user_id: 9, review_detail: 'Nice color and durable material.', creation_time: new Date('2024-11-09T08:00:00Z') },
            { ordinal_numbers: 2, product_id: 3, user_id: 10, review_detail: 'Compact and easy to move around.', creation_time: new Date('2024-11-10T09:00:00Z') },
            { ordinal_numbers: 3, product_id: 3, user_id: 11, review_detail: 'Very practical and useful.', creation_time: new Date('2024-11-11T10:00:00Z') },
            { ordinal_numbers: 4, product_id: 3, user_id: 12, review_detail: 'Excellent for everyday use.', creation_time: new Date('2024-11-12T11:00:00Z') },
            { ordinal_numbers: 5, product_id: 3, user_id: 13, review_detail: 'Highly satisfied with the build quality.', creation_time: new Date('2024-11-13T08:00:00Z') },
        
            // Product 4
            { ordinal_numbers: 1, product_id: 4, user_id: 14, review_detail: 'Strong and stable, great for daily use.', creation_time: new Date('2024-11-01T08:00:00Z') },
            { ordinal_numbers: 2, product_id: 4, user_id: 15, review_detail: 'The finish is beautiful and smooth.', creation_time: new Date('2024-11-02T09:00:00Z') },
            { ordinal_numbers: 3, product_id: 4, user_id: 16, review_detail: 'Solid construction, easy to clean.', creation_time: new Date('2024-11-03T10:00:00Z') },
            { ordinal_numbers: 4, product_id: 4, user_id: 17, review_detail: 'Looks fantastic in my office.', creation_time: new Date('2024-11-04T11:00:00Z') },
            { ordinal_numbers: 5, product_id: 4, user_id: 18, review_detail: 'Affordable and high-quality.', creation_time: new Date('2024-11-05T12:00:00Z') },
            { ordinal_numbers: 6, product_id: 4, user_id: 19, review_detail: 'Fits perfectly in my workspace.', creation_time: new Date('2024-11-06T13:00:00Z') },
            
            // Product 5
            { ordinal_numbers: 1, product_id: 5, user_id: 20, review_detail: 'Lovely design, adds charm to the room.', creation_time: new Date('2024-11-07T08:00:00Z') },
            { ordinal_numbers: 2, product_id: 5, user_id: 1, review_detail: 'Assembly was straightforward, no complaints.', creation_time: new Date('2024-11-08T09:00:00Z') },
            { ordinal_numbers: 3, product_id: 5, user_id: 2, review_detail: 'Nice finish, very durable.', creation_time: new Date('2024-11-09T10:00:00Z') },
            { ordinal_numbers: 4, product_id: 5, user_id: 3, review_detail: 'Modern and sleek look.', creation_time: new Date('2024-11-10T11:00:00Z') },
            { ordinal_numbers: 5, product_id: 5, user_id: 4, review_detail: 'Blends well with my other furniture.', creation_time: new Date('2024-11-11T12:00:00Z') },
            
            // Product 6
            { ordinal_numbers: 1, product_id: 6, user_id: 5, review_detail: 'Comfortable and easy to set up.', creation_time: new Date('2024-11-12T08:00:00Z') },
            { ordinal_numbers: 2, product_id: 6, user_id: 6, review_detail: 'The design is simple and elegant.', creation_time: new Date('2024-11-13T09:00:00Z') },
            { ordinal_numbers: 3, product_id: 6, user_id: 7, review_detail: 'Material quality exceeds expectations.', creation_time: new Date('2024-11-14T10:00:00Z') },
            { ordinal_numbers: 4, product_id: 6, user_id: 8, review_detail: 'Affordable yet stylish option.', creation_time: new Date('2024-11-15T11:00:00Z') },
            
            // Product 7
            { ordinal_numbers: 1, product_id: 7, user_id: 9, review_detail: 'Highly durable, great for outdoor use.', creation_time: new Date('2024-11-16T08:00:00Z') },
            { ordinal_numbers: 2, product_id: 7, user_id: 10, review_detail: 'The surface is scratch-resistant.', creation_time: new Date('2024-11-17T09:00:00Z') },
            { ordinal_numbers: 3, product_id: 7, user_id: 11, review_detail: 'Good design and functionality combined.', creation_time: new Date('2024-11-18T10:00:00Z') },
            { ordinal_numbers: 4, product_id: 7, user_id: 12, review_detail: 'Matches perfectly with my décor.', creation_time: new Date('2024-11-19T11:00:00Z') },
            { ordinal_numbers: 5, product_id: 7, user_id: 13, review_detail: 'Lightweight but feels sturdy.', creation_time: new Date('2024-11-20T12:00:00Z') },
            
            // Product 8
            { ordinal_numbers: 1, product_id: 8, user_id: 14, review_detail: 'Compact, fits well in small spaces.', creation_time: new Date('2024-11-21T08:00:00Z') },
            { ordinal_numbers: 2, product_id: 8, user_id: 15, review_detail: 'The quality of material is top-notch.', creation_time: new Date('2024-11-22T09:00:00Z') },
            { ordinal_numbers: 3, product_id: 8, user_id: 16, review_detail: 'Setup was easy, and it feels very stable.', creation_time: new Date('2024-11-23T10:00:00Z') },
            { ordinal_numbers: 4, product_id: 8, user_id: 17, review_detail: 'Great product for the price.', creation_time: new Date('2024-11-24T11:00:00Z') },
            
            // Product 9
            { ordinal_numbers: 1, product_id: 9, user_id: 18, review_detail: 'Stylish and functional.', creation_time: new Date('2024-11-25T08:00:00Z') },
            { ordinal_numbers: 2, product_id: 9, user_id: 19, review_detail: 'Love the design, fits my needs perfectly.', creation_time: new Date('2024-11-26T09:00:00Z') },
            { ordinal_numbers: 3, product_id: 9, user_id: 20, review_detail: 'Good for both home and office use.', creation_time: new Date('2024-11-27T10:00:00Z') },
            { ordinal_numbers: 4, product_id: 9, user_id: 1, review_detail: 'Quality product with a premium feel.', creation_time: new Date('2024-11-28T11:00:00Z') },
            
            // Product 10
            { ordinal_numbers: 1, product_id: 10, user_id: 2, review_detail: 'Assembly instructions were clear.', creation_time: new Date('2024-11-29T08:00:00Z') },
            { ordinal_numbers: 2, product_id: 10, user_id: 3, review_detail: 'Aesthetic design with a modern touch.', creation_time: new Date('2024-11-30T09:00:00Z') },
            { ordinal_numbers: 3, product_id: 10, user_id: 4, review_detail: 'Perfect for the living room.', creation_time: new Date('2024-12-01T10:00:00Z') },
            { ordinal_numbers: 4, product_id: 10, user_id: 5, review_detail: 'Value for money product.', creation_time: new Date('2024-12-02T11:00:00Z') },
    
            // Product 11
            { ordinal_numbers: 1, product_id: 11, user_id: 1, review_detail: 'Amazing product, very durable.', creation_time: new Date('2024-11-20T10:00:00Z') },
            { ordinal_numbers: 2, product_id: 11, user_id: 2, review_detail: 'Highly recommend for office use.', creation_time: new Date('2024-11-20T10:05:00Z') },
            { ordinal_numbers: 3, product_id: 11, user_id: 3, review_detail: 'Great value for the price.', creation_time: new Date('2024-11-20T10:10:00Z') },
            { ordinal_numbers: 4, product_id: 11, user_id: 4, review_detail: 'Perfect size for my room.', creation_time: new Date('2024-11-20T10:15:00Z') },

            // Product 12
            { ordinal_numbers: 1, product_id: 12, user_id: 5, review_detail: 'Comfortable and easy to assemble.', creation_time: new Date('2024-11-20T11:00:00Z') },
            { ordinal_numbers: 2, product_id: 12, user_id: 6, review_detail: 'Good build quality, works as expected.', creation_time: new Date('2024-11-20T11:05:00Z') },
            { ordinal_numbers: 3, product_id: 12, user_id: 7, review_detail: 'Stylish design, fits perfectly in my room.', creation_time: new Date('2024-11-20T11:10:00Z') },
            { ordinal_numbers: 4, product_id: 12, user_id: 8, review_detail: 'High-quality materials, very sturdy.', creation_time: new Date('2024-11-20T11:15:00Z') },

            // Product 13
            { ordinal_numbers: 1, product_id: 13, user_id: 9, review_detail: 'Nice color and durable material.', creation_time: new Date('2024-11-20T12:00:00Z') },
            { ordinal_numbers: 2, product_id: 13, user_id: 10, review_detail: 'Compact and easy to move around.', creation_time: new Date('2024-11-20T12:05:00Z') },
            { ordinal_numbers: 3, product_id: 13, user_id: 11, review_detail: 'Very practical and useful.', creation_time: new Date('2024-11-20T12:10:00Z') },
            { ordinal_numbers: 4, product_id: 13, user_id: 12, review_detail: 'Excellent for everyday use.', creation_time: new Date('2024-11-20T12:15:00Z') },
            { ordinal_numbers: 5, product_id: 13, user_id: 13, review_detail: 'Highly satisfied with the build quality.', creation_time: new Date('2024-11-20T12:20:00Z') },

            // Product 14
            { ordinal_numbers: 1, product_id: 14, user_id: 14, review_detail: 'Strong and stable, great for daily use.', creation_time: new Date('2024-11-21T09:00:00Z') },
            { ordinal_numbers: 2, product_id: 14, user_id: 15, review_detail: 'The finish is beautiful and smooth.', creation_time: new Date('2024-11-21T09:05:00Z') },
            { ordinal_numbers: 3, product_id: 14, user_id: 16, review_detail: 'Solid construction, easy to clean.', creation_time: new Date('2024-11-21T09:10:00Z') },
            { ordinal_numbers: 4, product_id: 14, user_id: 17, review_detail: 'Looks fantastic in my office.', creation_time: new Date('2024-11-21T09:15:00Z') },
            { ordinal_numbers: 5, product_id: 14, user_id: 18, review_detail: 'Affordable and high-quality.', creation_time: new Date('2024-11-21T09:20:00Z') },
            { ordinal_numbers: 6, product_id: 14, user_id: 19, review_detail: 'Fits perfectly in my workspace.', creation_time: new Date('2024-11-21T09:25:00Z') },

            // Product 15
            { ordinal_numbers: 1, product_id: 15, user_id: 20, review_detail: 'Lovely design, adds charm to the room.', creation_time: new Date('2024-11-21T10:00:00Z') },
            { ordinal_numbers: 2, product_id: 15, user_id: 1, review_detail: 'Assembly was straightforward, no complaints.', creation_time: new Date('2024-11-21T10:05:00Z') },
            { ordinal_numbers: 3, product_id: 15, user_id: 2, review_detail: 'Nice finish, very durable.', creation_time: new Date('2024-11-21T10:10:00Z') },
            { ordinal_numbers: 4, product_id: 15, user_id: 3, review_detail: 'Modern and sleek look.', creation_time: new Date('2024-11-21T10:15:00Z') },
            { ordinal_numbers: 5, product_id: 15, user_id: 4, review_detail: 'Blends well with my other furniture.', creation_time: new Date('2024-11-21T10:20:00Z') },
        
            // Product 16
            { ordinal_numbers: 1, product_id: 16, user_id: 5, review_detail: 'Comfortable and easy to set up.', creation_time: new Date('2024-11-22T08:00:00Z') },
            { ordinal_numbers: 2, product_id: 16, user_id: 6, review_detail: 'The design is simple and elegant.', creation_time: new Date('2024-11-22T08:05:00Z') },
            { ordinal_numbers: 3, product_id: 16, user_id: 7, review_detail: 'Material quality exceeds expectations.', creation_time: new Date('2024-11-22T08:10:00Z') },
            { ordinal_numbers: 4, product_id: 16, user_id: 8, review_detail: 'Affordable yet stylish option.', creation_time: new Date('2024-11-22T08:15:00Z') },

            // Product 17
            { ordinal_numbers: 1, product_id: 17, user_id: 9, review_detail: 'Highly durable, great for outdoor use.', creation_time: new Date('2024-11-22T09:00:00Z') },
            { ordinal_numbers: 2, product_id: 17, user_id: 10, review_detail: 'The surface is scratch-resistant.', creation_time: new Date('2024-11-22T09:05:00Z') },
            { ordinal_numbers: 3, product_id: 17, user_id: 11, review_detail: 'Good design and functionality combined.', creation_time: new Date('2024-11-22T09:10:00Z') },
            { ordinal_numbers: 4, product_id: 17, user_id: 12, review_detail: 'Matches perfectly with my décor.', creation_time: new Date('2024-11-22T09:15:00Z') },
            { ordinal_numbers: 5, product_id: 17, user_id: 13, review_detail: 'Lightweight but feels sturdy.', creation_time: new Date('2024-11-22T09:20:00Z') },

            // Product 18
            { ordinal_numbers: 1, product_id: 18, user_id: 14, review_detail: 'Compact, fits well in small spaces.', creation_time: new Date('2024-11-22T10:00:00Z') },
            { ordinal_numbers: 2, product_id: 18, user_id: 15, review_detail: 'The quality of material is top-notch.', creation_time: new Date('2024-11-22T10:05:00Z') },
            { ordinal_numbers: 3, product_id: 18, user_id: 16, review_detail: 'Setup was easy, and it feels very stable.', creation_time: new Date('2024-11-22T10:10:00Z') },
            { ordinal_numbers: 4, product_id: 18, user_id: 17, review_detail: 'Great product for the price.', creation_time: new Date('2024-11-22T10:15:00Z') },

            // Product 19
            { ordinal_numbers: 1, product_id: 19, user_id: 18, review_detail: 'Stylish and functional.', creation_time: new Date('2024-11-22T11:00:00Z') },
            { ordinal_numbers: 2, product_id: 19, user_id: 19, review_detail: 'Love the design, fits my needs perfectly.', creation_time: new Date('2024-11-22T11:05:00Z') },
            { ordinal_numbers: 3, product_id: 19, user_id: 20, review_detail: 'Good for both home and office use.', creation_time: new Date('2024-11-22T11:10:00Z') },
            { ordinal_numbers: 4, product_id: 19, user_id: 1, review_detail: 'Quality product with a premium feel.', creation_time: new Date('2024-11-22T11:15:00Z') },

            // Product 20
            { ordinal_numbers: 1, product_id: 20, user_id: 2, review_detail: 'Assembly instructions were clear.', creation_time: new Date('2024-11-22T12:00:00Z') },
            { ordinal_numbers: 2, product_id: 20, user_id: 3, review_detail: 'Aesthetic design with a modern touch.', creation_time: new Date('2024-11-22T12:05:00Z') },
            { ordinal_numbers: 3, product_id: 20, user_id: 4, review_detail: 'Perfect for the living room.', creation_time: new Date('2024-11-22T12:10:00Z') },
            { ordinal_numbers: 4, product_id: 20, user_id: 5, review_detail: 'Value for money product.', creation_time: new Date('2024-11-22T12:15:00Z') },
        ],
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
            { ordinal_numbers: 6, product_id: 10, directory_path: '/images/products/product3.jpg' },

            { ordinal_numbers: 1, product_id: 11, directory_path: '/images/products/product1.jpg' },
            { ordinal_numbers: 2, product_id: 11, directory_path: '/images/products/product2.jpg' },
            { ordinal_numbers: 3, product_id: 11, directory_path: '/images/products/product3.jpg' },
            { ordinal_numbers: 4, product_id: 11, directory_path: '/images/products/product4.jpg' },
            { ordinal_numbers: 5, product_id: 11, directory_path: '/images/products/product5.jpg' },
            { ordinal_numbers: 6, product_id: 11, directory_path: '/images/products/product6.jpg' },

            { ordinal_numbers: 1, product_id: 12, directory_path: '/images/products/product2.jpg' },
            { ordinal_numbers: 2, product_id: 12, directory_path: '/images/products/product3.jpg' },
            { ordinal_numbers: 3, product_id: 12, directory_path: '/images/products/product4.jpg' },
            { ordinal_numbers: 4, product_id: 12, directory_path: '/images/products/product5.jpg' },
            { ordinal_numbers: 5, product_id: 12, directory_path: '/images/products/product6.jpg' },
            { ordinal_numbers: 6, product_id: 12, directory_path: '/images/products/product7.jpg' },

            { ordinal_numbers: 1, product_id: 13, directory_path: '/images/products/product3.jpg' },
            { ordinal_numbers: 2, product_id: 13, directory_path: '/images/products/product4.jpg' },
            { ordinal_numbers: 3, product_id: 13, directory_path: '/images/products/product5.jpg' },
            { ordinal_numbers: 4, product_id: 13, directory_path: '/images/products/product6.jpg' },
            { ordinal_numbers: 5, product_id: 13, directory_path: '/images/products/product7.jpg' },
            { ordinal_numbers: 6, product_id: 13, directory_path: '/images/products/product8.jpg' },

            { ordinal_numbers: 1, product_id: 14, directory_path: '/images/products/product4.jpg' },
            { ordinal_numbers: 2, product_id: 14, directory_path: '/images/products/product5.jpg' },
            { ordinal_numbers: 3, product_id: 14, directory_path: '/images/products/product6.jpg' },
            { ordinal_numbers: 4, product_id: 14, directory_path: '/images/products/product7.jpg' },
            { ordinal_numbers: 5, product_id: 14, directory_path: '/images/products/product8.jpg' },
            { ordinal_numbers: 6, product_id: 14, directory_path: '/images/products/product9.jpg' },

            { ordinal_numbers: 1, product_id: 15, directory_path: '/images/products/product5.jpg' },
            { ordinal_numbers: 2, product_id: 15, directory_path: '/images/products/product6.jpg' },
            { ordinal_numbers: 3, product_id: 15, directory_path: '/images/products/product7.jpg' },
            { ordinal_numbers: 4, product_id: 15, directory_path: '/images/products/product8.jpg' },
            { ordinal_numbers: 5, product_id: 15, directory_path: '/images/products/product9.jpg' },
            { ordinal_numbers: 6, product_id: 15, directory_path: '/images/products/product10.jpg' },

            { ordinal_numbers: 1, product_id: 16, directory_path: '/images/products/product6.jpg' },
            { ordinal_numbers: 2, product_id: 16, directory_path: '/images/products/product7.jpg' },
            { ordinal_numbers: 3, product_id: 16, directory_path: '/images/products/product8.jpg' },
            { ordinal_numbers: 4, product_id: 16, directory_path: '/images/products/product9.jpg' },
            { ordinal_numbers: 5, product_id: 16, directory_path: '/images/products/product10.jpg' },
            { ordinal_numbers: 6, product_id: 16, directory_path: '/images/products/product11.jpg' },

            { ordinal_numbers: 1, product_id: 17, directory_path: '/images/products/product7.jpg' },
            { ordinal_numbers: 2, product_id: 17, directory_path: '/images/products/product8.jpg' },
            { ordinal_numbers: 3, product_id: 17, directory_path: '/images/products/product9.jpg' },
            { ordinal_numbers: 4, product_id: 17, directory_path: '/images/products/product10.jpg' },
            { ordinal_numbers: 5, product_id: 17, directory_path: '/images/products/product11.jpg' },
            { ordinal_numbers: 6, product_id: 17, directory_path: '/images/products/product12.jpg' },

            { ordinal_numbers: 1, product_id: 18, directory_path: '/images/products/product8.jpg' },
            { ordinal_numbers: 2, product_id: 18, directory_path: '/images/products/product9.jpg' },
            { ordinal_numbers: 3, product_id: 18, directory_path: '/images/products/product10.jpg' },
            { ordinal_numbers: 4, product_id: 18, directory_path: '/images/products/product11.jpg' },
            { ordinal_numbers: 5, product_id: 18, directory_path: '/images/products/product12.jpg' },
            { ordinal_numbers: 6, product_id: 18, directory_path: '/images/products/product1.jpg' },

            { ordinal_numbers: 1, product_id: 19, directory_path: '/images/products/product9.jpg' },
            { ordinal_numbers: 2, product_id: 19, directory_path: '/images/products/product10.jpg' },
            { ordinal_numbers: 3, product_id: 19, directory_path: '/images/products/product11.jpg' },
            { ordinal_numbers: 4, product_id: 19, directory_path: '/images/products/product12.jpg' },
            { ordinal_numbers: 5, product_id: 19, directory_path: '/images/products/product1.jpg' },
            { ordinal_numbers: 6, product_id: 19, directory_path: '/images/products/product2.jpg' },

            { ordinal_numbers: 1, product_id: 20, directory_path: '/images/products/product10.jpg' },
            { ordinal_numbers: 2, product_id: 20, directory_path: '/images/products/product11.jpg' },
            { ordinal_numbers: 3, product_id: 20, directory_path: '/images/products/product12.jpg' },
            { ordinal_numbers: 4, product_id: 20, directory_path: '/images/products/product1.jpg' },
            { ordinal_numbers: 5, product_id: 20, directory_path: '/images/products/product2.jpg' },
            { ordinal_numbers: 6, product_id: 20, directory_path: '/images/products/product3.jpg' }
        ]
    });

    await prisma.orders.createMany({
        data: [
            { user_id: 1, total_amount: 150.00, status: 'Completed', creation_time: new Date() },
            { user_id: 2, total_amount: 200.00, status: 'Processing', creation_time: new Date() },
            { user_id: 3, total_amount: 250.00, status: 'Pending', creation_time: new Date() },
            { user_id: 4, total_amount: 300.00, status: 'Completed', creation_time: new Date() },
            { user_id: 5, total_amount: 350.00, status: 'Cancelled', creation_time: new Date() },
            { user_id: 6, total_amount: 400.00, status: 'Completed', creation_time: new Date() },
            { user_id: 7, total_amount: 450.00, status: 'Shipped', creation_time: new Date() },
            { user_id: 8, total_amount: 500.00, status: 'Pending', creation_time: new Date() },
            { user_id: 9, total_amount: 550.00, status: 'Processing', creation_time: new Date() },
            { user_id: 10, total_amount: 600.00, status: 'Completed', creation_time: new Date() }
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