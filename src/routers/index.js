// const userRouter = require("./user");
// const productRouter = require("./product");
// const authRouter = require("./auth");
// const homeRouter = require("./home")
const userRouter = require("../app/user/route");
const productRouter = require("../app/product/route");
const authRouter = require("../app/auth/route");
const homeRouter = require("../app/home/route");
const adminRouter = require("../app/admin/route");
const middleware = require("../app/middleware/middleware");
const cartRouter = require("../app/cart/route");
const userProfileRouter = require("../app/userProfile/route");

function route(app) {
    app.use(middleware.isBan);
    app.use(middleware.checkAuthentication);
    app.use("/user", userRouter);
    app.use("/product", productRouter);
    app.use("/auth", authRouter);
    app.use("/admin", adminRouter);
    app.use("/cart", cartRouter);
    app.use("/", homeRouter);
    app.use("/userprofile", userProfileRouter);
}

module.exports = route;
