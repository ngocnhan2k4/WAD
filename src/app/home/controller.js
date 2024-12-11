const Home = require("./service");

const homeController = {
    home: async (req, res) => {
        try { 
            const newArrival = await Home.getNewArrival(); 
            const recomended = await Home.getRecomended();
            const userCheck = req.user 
            ? !await Home.findUserId(req.user.id) 
            : false;
            res.render("home", {
                page_style: "/css/tailwindcss.css",
                notAJAX: true,
                newArrival, 
                recomended,
                check: userCheck
            });
        } catch (error) {
            console.error("Error rendering home page:", error);
            res.render("home", { page_style: "/css/tailwindcss.css", notAJAX: true });
        }
    },
};

module.exports = homeController;