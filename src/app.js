const express = require("express");
const route = require("./routers");
const handlebars = require("express-handlebars");
const dotenv = require("dotenv");
const passport = require("./config/passport");
const session = require("express-session");

dotenv.config();

const app = express();

// Đăng ký các helper Handlebars
require("./app/helpers/paginationHelper");
require("./app/helpers/reviewsHelper");

app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine(
    "hbs",
    handlebars.engine({
        extname: ".hbs",
        helpers: {
            eq: (a, b) => a === b,
            neq: (a, b) => a !== b,
        },
    })
);

app.use(
    session({
        secret: "WAP", // Secret cho session
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Cần 'secure: true' nếu dùng HTTPS
    })
);

app.use(passport.initialize());
app.use(passport.session());

//add middleware to check isAuthen
app.use((req, res, next) => {
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
});

app.set("view engine", "hbs");
app.set("views", "./src/resources/views");
route(app);
//Middleware handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(process.env.PORT, () => {
    console.log(
        `Example app listening at http://localhost:${process.env.port}`
    );
});
