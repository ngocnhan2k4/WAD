const Home = require("./service");

const homeController = {
    home: async (req, res) => {
        try { 
            if (req.user) {
                const userId = req.user.id;
    
                // Lấy cartCookie từ cookies
                const cartCookie = req.cookies?.cart ? JSON.parse(req.cookies.cart) : []; // Giả sử cartCookie được lưu trong cookies
    
                if (cartCookie.length > 0) {
                    // Truyền cartCookie vào hàm moveCartItems
                    await Home.moveCartItems(userId, cartCookie);
    
                    // Xóa cookies sau khi đã gán sản phẩm
                    res.clearCookie('cart');
                }
            }
    
            const newArrival = await Home.getNewArrival(); 
            const recomended = await Home.getRecomended();
            
            res.render("home", {
                page_style: "/css/tailwindcss.css",
                notAJAX: true,
                newArrival, 
                recomended,
                check: req.user && !await Home.findUserId(req.user.id)
            });
        } catch (error) {
            console.error("Error rendering home page:", error);
            res.render("home", { page_style: "/css/tailwindcss.css", notAJAX: true });
        }
    },
};

module.exports = homeController;