const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function main(){
    await prisma.user.createMany({
        data:[
            {username:'nhansensei',password:'secret'},
            {username:'nhansensei1',password:'secret'},
        ]
    })
    await prisma.product.createMany({
        data:[
            {image:'/images/products/product1.jpg',name:'Sofa 1',original_price:55.9,discount_price:45.00,category:'Sofa',brand:'IKEA'},
            {image:'/images/products/product2.jpg',name:'Sofa 2',original_price:75.2,discount_price:50.00,category:'Sofa',brand:'IKEA'},
            {image:'/images/products/product3.jpg',name:'Airbed',original_price:25.9,discount_price:20.00,category:'Bedroom',brand:'Bestway'},
            {image:'/images/products/product4.jpg',name:'Bed 1',original_price:65.9,discount_price:55.00,category:'Bedroom',brand:'Bestway'},
            {image:'/images/products/product5.jpg',name:'Table and chair 1',original_price:150.9,discount_price:100.00,category:'Office',brand:'MDF'},
            {image:'/images/products/product6.jpg',name:'Chair',original_price:45.9,discount_price:35.00,category:'Outdoor',brand:'MDF'},
            {image:'/images/products/product7.jpg',name:'Table and chair 2',original_price:155.9,discount_price:112.00,category:'Office',brand:'MDF'},
            {image:'/images/products/product8.jpg',name:'Sofa chair 1',original_price:65.9,discount_price:43.00,category:'Outdoor',brand:'MDF'},
            {image:'/images/products/product9.jpg',name:'Sofa chair 2',original_price:75.9,discount_price:30.00,category:'Outdoor',brand:'MDF'},
            {image:'/images/products/product10.jpg',name:'Sofa chair 3',original_price:99,discount_price:89.00,category:'Outdoor',brand:'MDF'},
            {image:'/images/products/product11.jpg',name:'Bed 2',original_price:115.9,discount_price:112.00,category:'Bedroom',brand:'Bestway'},
            {image:'/images/products/product12.jpg',name:'Table',original_price:65.9,discount_price:43.00,category:'Office',brand:'MDF'},
        ]
    })
}


main()
    .catch((e) =>{
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });   