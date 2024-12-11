const Home = require("./service");

const homeController = {
    home: async (req, res) => {
        try { 
            const newArrival = await Home.getNewArrival(); 
            const recomended = await Home.getRecomended();
            // let userCheck = false;
            // if(!req.user)
            //     userCheck = false;
            // else{
            //     if(!req.user.id)
            //         userCheck = false;
            //     else
            //     userCheck = await Home.findUserId(req.user.id);
            // }
            res.render("home", {
                page_style: "/css/tailwindcss.css",
                notAJAX: true,
                newArrival, 
                recomended,
                // check: userCheck
            });
        } catch (error) {
            console.error("Error rendering home page:", error);
            res.render("home", { page_style: "/css/tailwindcss.css", notAJAX: true });
        }
    },
};

module.exports = homeController;