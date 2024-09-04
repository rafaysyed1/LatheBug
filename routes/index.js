const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedIn: false });
});

router.get("/shop", async function (req, res) {
    let products = await productModel.find();
    let error = req.flash("error");
    let success = req.flash("success");
    res.render("shop", { products, success, error, loggedIn: false});
});

router.get("/addtocart/:id", isLoggedIn, async function (req, res) {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        let productId = req.params.id;

        // Check if the product is already in the user's cart
        let alreadyInCart = user.cart.includes(productId);

        if (alreadyInCart) {
            req.flash("error", "Product is already added to cart");
            return res.redirect("/shop");
        }

        // Otherwise, add the product to the cart
        user.cart.push(productId);
        await user.save();
        req.flash("success", "Product added to cart!");
        res.redirect("/shop");
    } catch (error) {
        req.flash("error", "Something went wrong!");
        res.redirect("/shop");
    }
});


router.get("/cart", isLoggedIn, async function (req, res) {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart");
    let finalAmount = (user.cart[0].price + 20) - (user.cart[0].discount)
    res.render("cart", { user, finalAmount });

});


module.exports = router;