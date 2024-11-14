const Product = require('../services/productService')
const PRODUCTS_PER_PAGE = 3;

const productController = {
    getAllProducts: async (req, res) => {
        try{
            // if(req.query.pagination){
            //     req.query.category = '';
            //     req.query.brand = '';
            //     req.query.minPrice = '';
            //     req.query.maxPrice = '';
            //     req.query.search = '';
            //     req.query.sort = '';
            // }
            
            console.log('Query:\n', req.query);
            const allBrands = await Product.getBrands();
            const allCategories = await Product.getCategories();

            const page = parseInt(req.query.page) || 1;
            const where = getFilters(req.query);
            const orderBy = getSort(req.query);

            const totalProducts = await Product.getNumOfProduct(where); 
            const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
           
            const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
            const paginatedProducts = await Product.getAll(startIndex, PRODUCTS_PER_PAGE, orderBy, where);
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
                search: req.query.search
            }

            if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
                renderData.notAJAX = false;
                res.render('partials/product-list', renderData);
            } else {
                renderData.notAJAX = true;
                res.render('shop', renderData);
            }

            
        }catch(err){
            console.error('Error fetching products:', err);
            res.status(500).send('Internal Server Error');
        }
       
    },
    
    getProductDetail :(req,res)=>{
        res.render('product');
    }
};
const getFilters = (query) =>{
    const categories = Array.isArray(query.category) ? query.category : (query.category ? query.category.split(',') : []);
    const brands = Array.isArray(query.brand) ? query.brand : (query.brand ? query.brand.split(',') : []);
    const minPrice = parseFloat(query.minPrice) || 0;
    const maxPrice = parseFloat(query.maxPrice) || Number.MAX_VALUE;
    const search = query.search || '';
    let where = {};
    if(categories.length > 0 ){
        where.category = {in: categories};
    }
    if(brands.length > 0){
        where.brand = {in: brands};
    }
    if(minPrice || maxPrice){
        where.discount_price = {gte: minPrice, lte: maxPrice};
    }
    if(search){
        where.name = {contains: search, mode: 'insensitive'};
    }
    return where;
}

const getSort = (query) =>{
    const sort = query.sort || '';
    let orderBy = {};
    switch(sort){
        case 'price-low-to-high':
            orderBy = {discount_price: 'asc'};
            break;
        case 'price-high-to-low':
            orderBy = {discount_price: 'desc'};
            break;
        case 'name-asc':
            orderBy = {name: 'asc'};
            break;
        case 'name-desc':
            orderBy = {name: 'desc'};
            break;
        default:
            orderBy = {id: 'asc'};
        
    }
    return orderBy;
}


module.exports = productController;
