const userRouter = require("./user");
const productRouter = require("./product");
const authRouter = require("./auth");
const homeRouter = require("./home")
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
