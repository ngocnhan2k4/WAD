const Cart = require('./service')

const cartController = {
    getCart: async (req, res) => {
        try {
            if (!req.user) {
                // Nếu không có người dùng, chuyển hướng về trang đăng nhập
                return res.redirect("/user/login");
            }

            const userId = req.user.id;

            // Lấy dữ liệu từ service
            const cartItems = await Cart.getUserCart(userId);
            const subtotalData = await Cart.getCartTotal(userId);
            const itemCount = await Cart.getNumOfCartItems(userId);
            const orderID = await Cart.getNextOrderId();

            const subtotal = subtotalData._sum.price || 0;
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
            const { productId, quantity, rowSubtotal } = req.body; // Nhận thêm rowSubtotal
            const userId = req.user.id;
    
            if (!userId) {
                return res.status(400).send("User ID is required");
            }
    
            // Cập nhật số lượng sản phẩm trong giỏ hàng
            await Cart.updateCartItemQuantity(userId, productId, quantity, rowSubtotal);
    
            // Tính toán lại subtotal
            const subtotalData = await Cart.getCartTotal(userId);
            const subtotal = subtotalData._sum.price || 0;
    
            res.json({ updatedSubtotal: subtotal }); // Trả về subtotal đã cập nhật
        } catch (err) {
            console.error("Error updating cart item:", err);
            res.status(500).send("Internal Server Error");
        }
    },

    addToCart: async (req, res) => {
        try {
            const { productId, quantity } = req.body; // Nhận `productId` và `quantity` từ yêu cầu
            const userId = req.user.id; // Thay bằng logic lấy `userId` từ phiên đăng nhập hoặc yêu cầu
    
            if (!userId) {
                return res.status(400).send("User ID is required");
            }
    
            // Gọi service để thêm sản phẩm
            const result = await Cart.addProductToCart(userId, productId, quantity);
    
            if (result) {
                res.json({ message: "Product added to cart successfully!", type: "success" });
            } else {
                res.status(400).json({ message: "Failed to add product to cart.", type: "error" });
            }
        } catch (err) {
            console.error("Error adding product to cart:", err);
            res.status(500).send("Internal Server Error");
        }
    },

    deleteCartItem: async (req, res) => {
        try {
            const { productId } = req.body; // Lấy productId từ request body
            const userId = req.user.id; // Đảm bảo lấy đúng userId (nên lấy từ session hoặc auth)

            if (!userId) {
                return res.status(400).send("User ID is required");
            }

            // Gọi service để xóa sản phẩm khỏi giỏ hàng
            await Cart.deleteProductFromCart(userId, productId);

            // Tính toán lại subtotal sau khi xóa
            const subtotalData = await Cart.getCartTotal(userId);
            const subtotal = subtotalData._sum.price || 0;

            // Trả về response với subtotal cập nhật
            res.json({ message: "Product removed from cart", updatedSubtotal: subtotal });
        } catch (err) {
            console.error("Error deleting cart item:", err);
            res.status(500).send("Internal Server Error");
        }
    },

    getCartCount: async (req, res) => {
        try {
            if (!req.user) {
                // Nếu người dùng chưa đăng nhập, trả về loggedIn: false
                return res.json({ loggedIn: false, cartCount: 0 });
            }
    
            const userId = req.user.id;
    
            // Lấy tổng số lượng sản phẩm trong giỏ hàng từ service
            const itemCount = await Cart.getNumOfCartItems(userId);
    
            res.json({ loggedIn: true, cartCount: itemCount });
        } catch (err) {
            console.error("Error fetching cart count:", err);
            res.status(500).send("Internal Server Error");
        }
    },

    checkCart: async (req, res) => {
        try {
            const userId = req.user.id;

            // Gọi service để kiểm tra giỏ hàng
            const cartItems = await Cart.checkCart(userId);

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
            const userId = req.user.id;

            const subtotalData = await Cart.getCartTotal(userId);
            return subtotalData;
        } catch (error) {
            console.error('Error getting cart total in controller:', error.message);
            res.status(500).json({ message: 'Error getting cart' });
        }
    },
};

module.exports = cartController;
