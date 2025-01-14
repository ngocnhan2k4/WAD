const userProfile = require('./service');
const PRODUCTS_PER_PAGE = 3;
const ORDERS_PER_PAGE = 3;
const bcrypt = require("bcrypt");
const { DateTime } = require("luxon");

function formatDateSimple(date) {
    if (!date) return "Invalid DateTime";

    try {
        const jsDate = new Date(date);
        const parsedDate = DateTime.fromJSDate(jsDate, { zone: "utc" }).setZone(
            "Asia/Ho_Chi_Minh"
        );
        if (!parsedDate.isValid) {
            // console.error("Invalid DateTime:", date);
            return date;
        }

        return parsedDate.toFormat("dd/MM/yyyy");
    } catch (err) {
        console.error("Error parsing date:", date, err);
        return "Invalid DateTime";
    }
}

const userProfileController = {
    getUserProfile: async (req,res)=>{
        try{
            if(!req.user)
                return res.redirect("/user/login");
            
            console.log(req.user.id);
            const pageOrders = parseInt(req.query.pageOrders) || 1;
            const totalOrders = await userProfile.getNumOfOrders(req.user.id);//req.user.id 
            const totalOrderPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);
            const startOrderIndex = (pageOrders - 1) * ORDERS_PER_PAGE;
            const paginatedOrders = await userProfile.getOrders(startOrderIndex, ORDERS_PER_PAGE, req.user.id );//req.user.id
            const local = req.user.type == "local";
            const check = await userProfile.findUserId(req.user.id);
            let profile = null;
            if(check){
                profile = await userProfile.getUserDetail(req.user.id);
            }
            else{
                profile = {
                    name: "",
                    gender: "",
                    phone: "",
                    address: "",
                    birthday: ""
                }
            }

            const pageProducts = parseInt(req.query.pageProducts) || 1;
            const totalProducts = await userProfile.getNumOfProducts(req.user.id);//req.user.id 
            const totalProductPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
            const startProductIndex = (pageProducts - 1) * PRODUCTS_PER_PAGE;
            const paginatedProducts = await userProfile.getProducts(startProductIndex, PRODUCTS_PER_PAGE, req.user.id);//req.user.id

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
                                            profile,
                                            local,
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

    getOrderDetail: async (req, res) => {
        const id = req.params.id;
        const order = await userProfile.getOrderById(id);
        let count_number_product = 0;
        order.OrderDetail.forEach((OD) => {
            count_number_product += OD.quantity;
        });
        order.count_number_product = count_number_product;
        const products = [];
        order.OrderDetail.forEach((OD) => {
            const product = OD.Product;
            product.quantity = OD.quantity;
            products.push(product);
        });
        order.creation_time = formatDateSimple(order.creation_time);
        // if (order === null) {
        //     res.redirect("/admin/vieworder");
        //     return;
        // }
        order.creation_time = formatDateSimple(order.creation_time);
        const Payments = order.Payments[0];
        order.Payments = Payments;
        res.render("view_order_detail", {
            page_style: "/css/order_detail.css",
            order: order,
            products: products,
        });
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
    },
    updateStatus: async (req, res) => {
        const { orderId, newStatus } = req.body;
        try {
            await userProfile.updateStatus(req.user.id, parseInt(orderId,10), newStatus);
            res.status(200).json({ message: "Status updated" });
        } catch (err) {
            console.log(err);
            res.status(500).send("An error occurred");
        }
    },
    
    getProfile: async (req, res) => {
        const userId = req.user.id; // Lấy userId từ URL
        try {
            const userDetails = await userProfile.getUserDetailsById(parseInt(userId, 10)); // Gọi service
            if (!userDetails) {
                return res.status(404).json({ message: 'User details not found' });
            }
            res.status(200).json(userDetails); // Trả về JSON
        } catch (err) {
            console.error('Error in getUserDetails:', err);
            res.status(500).send('An error occurred');
        }
    },
}

module.exports = userProfileController;