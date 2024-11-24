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
};

module.exports = middleware;
