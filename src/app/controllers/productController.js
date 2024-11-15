const Product = require('../services/productService')
const PRODUCTS_PER_PAGE = 3;

const productController = {
    getAllProducts: async (req, res) => {
        try{

            //console.log('Query:\n', req.query);
            const allBrands = await Product.getBrands();
            const allCategories = await Product.getCategories();

            const page = parseInt(req.query.page) || 1;
            const where = getFilters(req.query);
            const orderBy = getSort(req.query);

            const totalProducts = await Product.getNumOfProduct(where); 
            //console.log("Tong so san pham: "+totalProducts);
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
        where.category = {
            category_name: {in: categories}
        };
    }
    if (brands.length > 0) {
        where.Manufacturer = {
            brand: { in: brands }
        };
    }
    if(minPrice || maxPrice){
        where.current_price = {gte: minPrice, lte: maxPrice};
    }
    if(search){
        where.product_name = {contains: search, mode: 'insensitive'};
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
        default:
            orderBy = {product_id: 'asc'};
        
    }
    return orderBy;
}


module.exports = productController;
