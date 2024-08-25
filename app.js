const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const path = require('path');
const db = require("./config/dbConfig")
const ejs = require('ejs');
const ownerRouter = require("./routes/ownerRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const indexRouter = require("./routes/index")
const flash = require('connect-flash');
const expressSession = require('express-session')

app.use(express.json());
require("dotenv").config();

app.use(expressSession({
        resave : false,
        saveUninitialized : false,
        secret : process.env.EXPRESS_SESSION_SECRET,
        
}))
app.use(flash());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine",'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/",indexRouter);
app.use("/owner",ownerRouter);
app.use("/user",userRouter);
app.use("/products",productRouter);

app.get("/",(req,res)=>{
        res.send("Server started!");
})

app.listen(4000);