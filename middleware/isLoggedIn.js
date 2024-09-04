const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

module.exports = async function (req,res,next) {
    if(!req.cookies.token){
        return res.redirect("/");
    }
    try {
        let decodedUser = jwt.verify(req.cookies.token,process.env.JWT_KEY);
        let user = await userModel.findOne({email : decodedUser.email}).select("-password");

        req.user = user;
        next()
    } catch (error) {
        req.flash("error","Something went wrong!");
        res.redirect("/");
    }
}