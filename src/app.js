const express = require('express');
const route = require('./routers');
const handlebars = require("express-handlebars");
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(express.static("./src/public"));
app.use('/node_modules', express.static('node_modules'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("hbs", handlebars.engine({  extname: ".hbs", }));

    
app.set("view engine", "hbs");
app.set("views", "./src/resources/views");

route(app);

//Middleware handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});


app.listen(process.env.PORT, ()=>{
    console.log(`Example app listening at http://localhost:${process.env.port}`)
})  