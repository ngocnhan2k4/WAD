// const userRouter = require("./user");
// const productRouter = require("./product");
// const authRouter = require("./auth");
// const homeRouter = require("./home")
const userRouter = require("../app/user/route");
const productRouter = require("../app/product/route");
const authRouter = require("../app/auth/route");
const homeRouter = require("../app/home/route")
function route(app) {
    app.use("/reset-password", (req, res) => {
        res.render("reset_password");
    });
    app.use("/user", userRouter);
    app.use("/product", productRouter);
    app.use("/auth", authRouter);
    app.use("/", homeRouter);
}

module.exports = route;
