const { admin } = require('googleapis/build/src/apis/admin');
const Product = require('./service')
const dayjs = require("dayjs");
const PRODUCTS_PER_PAGE = 6;

const productController = {
    getAllProducts: async (req, res) => {
        try{

            console.log('Query:\n', req.query);
            console.log('User:\n', req.user);
            let isAdmin = true;
            if(!req.user || req.user.role != 'admin')
                isAdmin = false;
            
            const allBrands = await Product.getBrands();
            const allCategories = await Product.getCategories();

            const page = parseInt(req.query.page) || 1;
            const where = getFilters(req.query);
            const orderBy = getSort(req.query);

            const totalProducts = await Product.getNumOfProduct(where); 
            console.log("Tong so san pham: "+totalProducts);
            const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
           
            const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
            const paginatedProducts = await Product.getAll(startIndex, PRODUCTS_PER_PAGE, orderBy, where);

            //add
            if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
                return res.json({ 
                    products: paginatedProducts,
                    currentPage: page,
                    totalPages,
                    hasPreviousPage: page > 1,
                    hasNextPage: page < totalPages,
                    previousPage: page - 1,
                    nextPage: page + 1,
                    pages: Array.from({ length: totalPages }, (_, index) => index + 1),
                    sort: req.query.sort,
                    category: req.query.category,
                    brand: req.query.brand,
                    minPrice: req.query.minPrice,
                    maxPrice: req.query.maxPrice,
                    search: req.query.search,
                    admin: isAdmin,
                });
            }

            const renderData = {
                brands: allBrands,
                categories: allCategories,
                products: paginatedProducts,
                currentPage: page,
                totalPages,
                hasPreviousPage: page > 1,
                hasNextPage: page < totalPages,
                previousPage: page - 1,
                nextPage: page + 1,
                pages: Array.from({ length: totalPages }, (_, index) => index + 1),
                sort: req.query.sort,
                category: req.query.category,
                brand: req.query.brand,
                minPrice: req.query.minPrice,
                maxPrice: req.query.maxPrice,
                search: req.query.search,
                admin: isAdmin,
                
            }
            res.render('shop', renderData);

            // if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
            //     renderData.notAJAX = false;
            //     res.render('partials/product-list', renderData);
            // } else {
            //     renderData.notAJAX = true;
            //     res.render('shop', renderData);
            // }

            
        }catch(err){
            console.error('Error fetching products:', err);
            res.status(500).send('Internal Server Error');
        }
       
    },
    
    getProductDetail: async (req, res) => {
        try {
            const productId = parseInt(req.query.id);
            if (!productId) {
                return res.status(400).json({ error: 'Product ID is required' });
            }
    
            const product = await Product.getProductById(productId);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
    
            const REVIEWS_PER_PAGE = 2;
            const page = parseInt(req.query.page) || 1;
            const startIndex = (page - 1) * REVIEWS_PER_PAGE;
    
            let reviews = await Product.getReviews(productId, startIndex, REVIEWS_PER_PAGE);

            // Chỉ định dạng creation_time
            reviews = reviews.map((review) => ({
                ...review,
                creation_time: dayjs(review.creation_time).format("DD/MM/YYYY HH:mm:ss"), // Chuyển đổi định dạng
            }));
                
            const totalReviews = await Product.getNumOfReviews(productId);
            const totalPages = Math.ceil(totalReviews / REVIEWS_PER_PAGE);
    
            const pagination = {
                currentPage: page,
                totalPages: totalPages,
                hasPreviousPage: page > 1,
                hasNextPage: page < totalPages,
                previousPage: page - 1,
                nextPage: page + 1,
                pages: Array.from({ length: totalPages }, (_, i) => i + 1)
            };
    
            if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
                return res.json({
                    product,
                    reviews,
                    pagination,
                });
            }
    
            const relatedProducts = await Product.getRelatedProducts(product.category_id, product.product_id);
            const availability = product.stock_quantity > 0 ? 'In stock' : 'Out of stock';
    
            const renderData = {
                product,
                relatedProducts,
                reviews,
                availability,
                pagination,
                user: req.user || null,
            };

            renderData.notAJAX = true;
    
            res.render('product', renderData);
        } catch (err) {
            console.error('Error fetching product details:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },    
    
    addReview: async (req, res) => {
        try {
            const { productId, reviewDetail, userId } = req.body;
    
            if (!productId || !reviewDetail || !userId) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const newReview = await Product.addReview({
                product_id: parseInt(productId),
                user_id: parseInt(userId),
                review_detail: reviewDetail,
                creation_time: new Date(),
            });
    
            res.status(201).json({ message: "Review added successfully", review: newReview });
        } catch (err) {
            console.error("Error adding review:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};
const getFilters = (query) =>{
    const categories = Array.isArray(query.category) ? query.category : (query.category ? query.category.split(',') : []);
    const brands = Array.isArray(query.brand) ? query.brand : (query.brand ? query.brand.split(',') : []);
    const minPrice = parseFloat(query.minPrice) || 0;
    const maxPrice = parseFloat(query.maxPrice) || Number.MAX_VALUE;
    const search = query.search || '';
    let where = {};
    if(categories.length > 0 ){
        where.Categories = {
            category_name: {in: categories}
        };
    }
    if (brands.length > 0) {
        where.Suppliers = {
            brand: { in: brands }
        };
    }
    if(minPrice || maxPrice){
        where.current_price = {gte: minPrice, lte: maxPrice};
    }
    if(search){
        where.OR = [
            { product_name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
        ];
    }
    return where;
}

const getSort = (query) =>{
    const sort = query.sort || '';
    let orderBy = {};
    switch(sort){
        case 'price-low-to-high':
            orderBy = {current_price: 'asc'};
            break;
        case 'price-high-to-low':
            orderBy = {current_price: 'desc'};
            break;
        case 'name-asc':
            orderBy = {product_name: 'asc'};
            break;
        case 'name-desc':
            orderBy = {product_name: 'desc'};
            break;
        case 'total-asc':
            orderBy = { total_purchase: 'asc' };
            break;
        case 'total-desc':
            orderBy = { total_purchase: 'desc' };
            break;
        default:
            orderBy = {product_id: 'asc'};
        
    }
    return orderBy;
}


module.exports = productController;