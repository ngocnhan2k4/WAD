const Product = require("../services/productService");
const PRODUCTS_PER_PAGE = 2; // Number of products per page

const products = [
    {
        image: "/images/products/product1.jpg",
        name: "Guyer Chair",
        original_price: "$55.90",
        promotional_price: "$45.00",
    },
    {
        image: "/images/products/product2.jpg",
        name: "Guyer Chair",
        original_price: "$55.90",
        promotional_price: "$45.00",
    },
    {
        image: "/images/products/product3.jpg",
        name: "Guyer Chair",
        original_price: "$55.90",
        promotional_price: "$45.00",
    },
    {
        image: "/images/products/product4.jpg",
        name: "Guyer Chair",
        original_price: "$55.90",
        promotional_price: "$45.00",
    },
    {
        image: "/images/products/product5.jpg",
        name: "Guyer Chair",
        original_price: "$55.90",
        promotional_price: "$45.00",
    },
    {
        image: "/images/products/product6.jpg",
        name: "Guyer Chair",
        original_price: "$55.90",
        promotional_price: "$45.00",
    },
];

const productController = {
    getAllProducts: async (req, res) => {
        console.log("req.query", req.query);
        const page = parseInt(req.query.page) || 1; // Get the current page from query params, default to 1
        console.log(page);
        const totalProducts = products.length; // Total number of products
        const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE); // Calculate total pages
        const pageArr = [];
        for (let i = 1; i <= totalPages; i++) {
            pageArr.push(i);
        }
        // Calculate the starting and ending index of products for the current page
        const startIndex = (page - 1) * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;

        // Get the subset of products for the current page
        const paginatedProducts = products.slice(startIndex, endIndex);

        // Render the template with pagination data
        res.render("shop", {
            products: paginatedProducts, // Pass the products for the current page
            currentPage: page,
            totalPages,
            hasPreviousPage: page > 1,
            hasNextPage: page < totalPages,
            previousPage: page - 1,
            nextPage: page + 1,
            pages: pageArr, // 1 -> totalPages
        });
    },
    getProductDetail: (req, res) => {
        res.render("product");
    },
};

module.exports = productController;
