const middleware = {
    isBan: (req, res, next) => {
        if (req.isAuthenticated() && req.user && req.user.state === "ban") {
            req.logout((err) => {
                if (err) {
                    return res.status(500).send("Error logging out.");
                }
            });
            return res.redirect("/auth/ban");
        } else next();
    },

    checkAuthentication: (req, res, next) => {
        let isAuth = false;
        let userName = "";
        let userAvatar = "";
        let fullName = "";
        if(req.user){
            isAuth = true;
            if(req.user.fullName.length <=9)
                userName = req.user.fullName;
            else
            userName = req.user.fullName.slice(0, 9) + '...';
            fullName = req.user.fullName;
    
            userAvatar = req.user.user_image;
        }
        res.locals.isAuthen = isAuth;
        
        res.locals.userName = userName;
        res.locals.userAvatar = userAvatar;
        res.locals.fullName = fullName;
        next();
    }
};

module.exports = middleware;
