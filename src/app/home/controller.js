const Home = require("./service");

const homeController = {
    home: async (req, res) => {
        try { 
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