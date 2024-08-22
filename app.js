const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const path = require('path');
const db = require("./config/dbConfig")
const ejs = require('ejs');
const ownerRouter = require("./routes/ownerRouter");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"public")));
app.set("view engine",ejs);

app.use("/owner",ownerRouter);
app.use("/user",userRouter);
app.use("/products",productRouter);

app.get("/",(req,res)=>{
        res.send("Server started!");
})

app.listen(4000);