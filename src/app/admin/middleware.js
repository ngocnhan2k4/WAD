const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.role === "admin") {
        next();
    } else {
        res.redirect("/");
    }
};

module.exports = isAdmin;
