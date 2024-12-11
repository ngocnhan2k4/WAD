const userProfile = require('./service');
const PRODUCTS_PER_PAGE = 3;
const ORDERS_PER_PAGE = 3;
const bcrypt = require("bcrypt");

const userProfileController = {
    getUserProfile: async (req,res)=>{
        try{
            if(!req.user)
                return res.redirect("/user/login");
            const pageOrders = parseInt(req.query.pageOrders) || 1;
            const totalOrders = await userProfile.getNumOfOrders(req.user.id );//req.user.id 
            const totalOrderPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
            const startOrderIndex = (pageOrders - 1) * ORDERS_PER_PAGE;
            const paginatedOrders = await userProfile.getOrders(startOrderIndex, ORDERS_PER_PAGE, 1);//req.user.id
            // const local = req.user.type == "local";
            // const check = await userProfile.findUserId(req.user.id);
            // let profile = null;
            // if(check){
            //     profile = await userProfile.getUserDetail(req.user.id);
            // }
            // else{
            //     profile = {
            //         name: "",
            //         gender: "",
            //         phone: "",
            //         address: "",
            //         birthday: ""
            //     }
            // }

            const pageProducts = parseInt(req.query.pageProducts) || 1;
            const totalProducts = await userProfile.getNumOfProducts(1);//req.user.id 
            const totalProductPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
            const startProductIndex = (pageProducts - 1) * PRODUCTS_PER_PAGE;
            const paginatedProducts = await userProfile.getProducts(startProductIndex, PRODUCTS_PER_PAGE, 1);//req.user.id

            const activeTab = req.query.activeTab || 'orders';
            return res.render("userprofile",{
                                            page_style:"/css/profile.css", 
                                            paginatedOrders,
                                            currentOrderPage: pageOrders,
                                            totalOrderPages,
                                            hasPreviousOrderPage: pageOrders > 1,
                                            hasNextOrderPage: pageOrders < totalOrderPages,
                                            previousOrderPage: pageOrders - 1,
                                            nextOrderPage: pageOrders + 1,
                                            Orderpages: Array.from({ length: totalOrderPages }, (_, index) => index + 1),
                                            // profile,
                                            // local,
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
        }catch(err){
            console.log(err);
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

      
    verifyOldPassword: async (req, res) => {
        const { oldPassword } = req.body;
        if (!req.user) {
            return res.status(404).json({ message: "User not found" });
        }
        // So sánh mật khẩu cũ với mật khẩu đã mã hóa trong cơ sở dữ liệu
        const isMatch = await bcrypt.compare(oldPassword, req.user.password);
        if (isMatch) {
            return res.json({ isMatch: true });
        } else {
            return res.json({ isMatch: false });
        }
   
    },
    updatePassword: async (req, res) => {
        console.log("Update password");
        const { newPassword } = req.body;
        console.log(newPassword);
        try {
            await userProfile.updatePassword(req.user.id, newPassword);
            res.status(200).json({ message: "Password updated" });
        } catch (err) {
            console.log(err);
            res.status(500).send("An error occurred");
        }
    },
    updateProfile: async (req, res) => {
        const { name, gender, phone, province, district, ward, address, birthday} = req.body;
        const addr = `${address}, ${ward}, ${district}, ${province}`;
        const check = await userProfile.findUserId(req.user.id);
        try{
        if (check) {
            await userProfile.updateProfile(req.user.id,name, gender, phone, addr, birthday);
            res.status(200).json({ message: "Profile updated" });
        }
        else {
            await userProfile.createProfile(req.user.id,name, gender, phone, addr, birthday);
            res.status(200).json({ message: "Profile updated" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("An error occurred");
    }
    }
    
    
}

module.exports = userProfileController;