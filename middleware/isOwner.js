const jwt = require('jsonwebtoken');
const ownerModel = require("../models/ownerModel");

const isOwner = async (req, res, next) => {
    try {
        let token = req.signedCookies.ownerToken;
        if (!token) {
            return res.redirect("/owner/login");
        }

        // Verify the token and get the owner's email
        let decoded = jwt.verify(token, process.env.JWT_KEY);
        let owner = await ownerModel.findOne({ email: decoded.email });

        if (!owner) {
            req.flash("error", "Invalid token.");
            return res.redirect("/owner/login");
        }

        req.owner = owner;  
        next();
    } catch (error) {
        req.flash("error", "Access denied!");
        return res.redirect("/owner/login");
    }
};

module.exports = isOwner;
