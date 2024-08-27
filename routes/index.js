const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middleware/isLoggedIn');
const productModel = require('../models/productModel');
router.get("/",function(req,res){
    let error = req.flash("error");
    res.render("index",{error,loggedIn : false});
});

router.get("/shop",isLoggedIn,async function (req,res) {
   let products =  await productModel.find();
    res.render("shop",{products});
});
router.get("/addtocart/:id",isLoggedIn,async function (req,res) {
    let user =  await userModel.findOne({user: req.user._id});
    
 });

module.exports = router;