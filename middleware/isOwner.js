const ownerModel = require("../models/ownerModel");

const checkOwner = async (req, res, next) => {
    try {
        // Check if the user is logged in
        if (!req.user) {
            req.flash("error", "Please log in to continue.");
            return res.redirect("/owner/login");
        }

        // Find the only owner in the database
        const owner = await ownerModel.findOne();

        // Check if the logged-in user is the owner
        if (req.user.email === owner.email) {
            next(); // User is the owner, proceed to the next middleware or route handler
        } else {
            req.flash("error", "Access denied! Only the owner admin can create products.");
            return res.redirect("/");
        }
    } catch (error) {
        req.flash("error", "Access denied!");
        return res.redirect("/owner/login");
    }
};

module.exports = checkOwner;
