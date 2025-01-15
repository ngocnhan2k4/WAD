const Cart = require('./service')

const cartController = {
    getCart: async (req, res) => {
        try {
            let userId = null;
            let cartCookie = req.cookies?.cart ? JSON.parse(req.cookies.cart) : [];
    
            if (req.user) {
                userId = req.user.id;
            }
    
            // Lấy dữ liệu từ service
            const cartItems = await Cart.getUserCart(userId, cartCookie);
            const subtotal = await Cart.getCartTotal(userId, cartCookie);
            const itemCount = await Cart.getNumOfCartItems(userId, cartCookie);
            const orderID = await Cart.getNextOrderId();
    
            const subtotalVND = subtotal * 25400;
    
            const renderData = {
                cartItems,
                subtotal,
                itemCount,
                subtotalVND,
                orderID,
            };
            renderData.notAJAX = true;
    
            console.log(renderData);
    
            // Kiểm tra yêu cầu AJAX
            if (req.headers["x-requested-with"] === "XMLHttpRequest") {
                res.render("partials/cart-list", renderData);
            } else {
                res.render("cart", { ...renderData, page_style: "/css/cart.css" });
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
            res.status(500).send("Internal Server Error");
        }
    },    

    updateCartItemQuantity: async (req, res) => {
        try {
            const { productId, quantity, rowSubtotal } = req.body; // Nhận productId, quantity và rowSubtotal từ yêu cầu
            let userId = null;
    
            if (req.user) {
                userId = req.user.id;
            }
    
            // Lấy giỏ hàng từ cookies hoặc khởi tạo giỏ hàng mới
            const cartCookie = req.cookies?.cart ? JSON.parse(req.cookies.cart) : [];
    
            // Cập nhật số lượng sản phẩm
            const updatedCart = await Cart.updateCartItemQuantity(userId, productId, quantity, rowSubtotal, cartCookie);
    
            // Nếu user chưa đăng nhập, cập nhật cookie
            if (userId === null) {
                res.cookie("cart", JSON.stringify(updatedCart), {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
                });
            }
    
            // Tính toán lại subtotal
            const subtotal = await Cart.getCartTotal(userId, updatedCart);
    
            res.json({ updatedSubtotal: subtotal }); // Trả về subtotal đã cập nhật
        } catch (err) {
            console.error("Error updating cart item:", err);
            res.status(500).send("Internal Server Error");
        }
    },    

    addToCart: async (req, res) => {
        try {
            const { productId, quantity } = req.body;
            let userId = null;
    
            if (req.user) {
                userId = req.user.id;
            }
    
            // Lấy giỏ hàng từ cookies hoặc khởi tạo giỏ hàng mới
            let cartCookie = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    
            // Gọi service để xử lý
            const result = await Cart.addProductToCart(userId, productId, quantity, cartCookie);
    
            if (userId === null) {
                // Nếu user chưa đăng nhập, cập nhật cookie
                res.cookie("cart", JSON.stringify(result), {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
                });
            }
    
            res.json({ message: "Product added to cart successfully!", type: "success" });
        } catch (err) {
            console.error("Error adding product to cart:", err);
            res.status(500).send("Internal Server Error");
        }
    },

    deleteCartItem: async (req, res) => {
        try {
            const { productId } = req.body; // Lấy productId từ request body
            let userId = null;
            if (req.user) {
                userId = req.user.id;
            }
    
            // Lấy giỏ hàng từ cookies hoặc khởi tạo giỏ hàng mới
            const cartCookie = req.cookies?.cart ? JSON.parse(req.cookies.cart) : [];
    
            // Gọi service để xóa sản phẩm
            const updatedCart = await Cart.deleteProductFromCart(userId, productId, cartCookie);
    
            // Nếu user chưa đăng nhập, cập nhật cookie
            if (userId === null) {
                res.cookie("cart", JSON.stringify(updatedCart), {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
                });
            }
    
            // Tính toán lại subtotal
            const subtotal = await Cart.getCartTotal(userId, updatedCart);
    
            res.json({ message: "Product removed from cart", updatedSubtotal: subtotal });
        } catch (err) {
            console.error("Error deleting cart item:", err);
            res.status(500).send("Internal Server Error");
        }
    },    

    getCartCount: async (req, res) => {
        try {
            let userId = null;
            if (req.user) {
                userId = req.user.id;
            }
    
            // Lấy giỏ hàng từ cookies hoặc khởi tạo giỏ hàng mới
            const cartCookie = req.cookies?.cart ? JSON.parse(req.cookies.cart) : [];
    
            // Gọi service để tính toán số lượng sản phẩm
            const itemCount = await Cart.getNumOfCartItems(userId, cartCookie);
    
            res.json({ loggedIn: true, cartCount: itemCount });
        } catch (err) {
            console.error("Error fetching cart count:", err);
            res.status(500).send("Internal Server Error");
        }
    },

    checkCart: async (req, res) => {
        try {
            let userId = null;
            let cartCookie = req.cookies.cart || []; // Lấy giỏ hàng từ cookies, mặc định là mảng rỗng
    
            if (req.user) {
                userId = req.user.id;
            }
    
            // Gọi service để kiểm tra giỏ hàng
            const cartItems = await Cart.checkCart(userId, cartCookie);
    
            if (!cartItems || cartItems.length === 0) {
                // Nếu giỏ hàng trống, trả về thông báo
                return res.status(200).json({ cartItems: [] });
            }
    
            // Nếu có sản phẩm, trả về danh sách sản phẩm trong giỏ hàng
            return res.status(200).json({ cartItems });
        } catch (error) {
            console.error('Error checking cart in controller:', error.message);
            res.status(500).json({ message: 'Error checking cart' });
        }
    },    

    getTotal: async (req, res) => {
        try {
            let userId = null;
            let cartCookie = req.cookies.cart || []; // Lấy giỏ hàng từ cookies, mặc định là mảng rỗng
    
            if (req.user) {
                userId = req.user.id;
            }
    
            // Gọi service để tính tổng giá trị giỏ hàng
            const subtotal = await Cart.getCartTotal(userId, cartCookie);
    
            return res.status(200).json({ subtotal });
        } catch (error) {
            console.error('Error getting cart total in controller:', error.message);
            res.status(500).json({ message: 'Error getting cart total' });
        }
    },    
};

module.exports = cartController;
