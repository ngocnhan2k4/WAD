const userProfile = require('./service');
const PRODUCTS_PER_PAGE = 2;
const ORDERS_PER_PAGE = 1;


const userProfileController = {
    getUserProfile: async (req,res)=>{
        try{
            if(!req.user)
                return res.redirect("/user/login");
            const pageOrders = parseInt(req.query.pageOrders) || 1;
            const totalOrders = await userProfile.getNumOfOrders(1);//req.user.id 
            const totalOrderPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
            const startOrderIndex = (pageOrders - 1) * ORDERS_PER_PAGE;
            const paginatedOrders = await userProfile.getOrders(startOrderIndex, ORDERS_PER_PAGE, 1);//req.user.id


            const pageProducts = parseInt(req.query.pageProducts) || 1;
            const totalProducts = await userProfile.getNumOfProducts(1);//req.user.id 
            const totalProductPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
            const startProductIndex = (pageProducts - 1) * PRODUCTS_PER_PAGE;
            const paginatedProducts = await userProfile.getProducts(startProductIndex, PRODUCTS_PER_PAGE, 1);//req.user.id

            // console.log(totalProducts);
            // console.log(paginatedProducts);
            //const orders = await userProfile.getOrders(1); //req.user.id

            // const products = await userProfile.getProducts(1); //req.user.id
            const activeTab = req.query.activeTab || 'orders';
            return res.render("userprofile",{
                                            page_style:"/css/profile.css", 
                                            paginatedOrders,
                                            // products,
                                            currentOrderPage: pageOrders,
                                            totalOrderPages,
                                            hasPreviousOrderPage: pageOrders > 1,
                                            hasNextOrderPage: pageOrders < totalOrderPages,
                                            previousOrderPage: pageOrders - 1,
                                            nextOrderPage: pageOrders + 1,
                                            Orderpages: Array.from({ length: totalOrderPages }, (_, index) => index + 1),

                                            activeTab,
                                            paginatedProducts,
                                            currentProductPage: pageProducts,
                                            totalProductPages,
                                            hasPreviousProductPage: pageProducts > 1,
                                            hasNextProductPage: pageProducts < totalProductPages,
                                            previousProductPage: pageProducts - 1,
                                            nextProductPage: pageProducts + 1,
                                            Productpages: Array.from({ length: totalProductPages }, (_, index) => index + 1),
                                        
                                        });
        }catch{
            res.status(500).send("Internal Server Error");
        }
    },

    updateImage: async (req, res) => {
        if (!req.file) {
          return res.status(400).send("No file uploaded.");
        }
      
        const filePath = req.file.path; // URL của ảnh trên Cloudinary
        await userProfile.updateImage(req.user.id, filePath);

        
        res.status(200).json({ message: "Avatar updated successfully", avatarUrl: filePath });
      },
    
    
}

module.exports = userProfileController;