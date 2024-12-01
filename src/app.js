const express = require("express");
const route = require("./routers");
const handlebars = require("express-handlebars");
const dotenv = require("dotenv");
const passport = require("./config/passport");
const session = require("express-session");
const notification = require('./app/middleware/notification');

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


app.use(session({
    secret: 'notification',
    resave: false,
    saveUninitialized: true,
}));

app.use(notification);


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
