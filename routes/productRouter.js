const express = require('express');
const router = express.Router();
const upload = require("../config/multerConfig");
const productModel = require("../models/productModel");

router.post("/create", upload.single("image"), async function (req, res) {
 try {
    let { productName,
        price,
        discount,
        bgColor,
        panelColor,
        textColor } = req.body;
    console.log(req.body);
    let product = await productModel.create({
        image: req.file.buffer,
        productName,
        price,
        discount,
        bgColor,
        panelColor,
        textColor

    });
    req.flash("success","Product created successfully");
    res.redirect("/owner/admin")
 } catch (error) {
    res.send(error.message)
 }
});

module.exports = router;