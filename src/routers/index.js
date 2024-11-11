const userRouter = require("./user");
const productRouter = require("./product");
const authRouter = require("./auth");
function route(app) {
    app.use("/user", userRouter);
    app.use("/product", productRouter);
    app.use("/auth", authRouter);
}

module.exports = route;
