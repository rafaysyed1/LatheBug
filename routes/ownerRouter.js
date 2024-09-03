const express = require('express');
const router = express.Router();
const ownerModel = require("../models/ownerModel");
const bcrypt = require("bcrypt");
const { generateToken } = require('../utils/generateToken');
const isOwner = require("../middleware/isOwner");

// Only in development mode 
if (process.env.NODE_ENV === "development") {
    router.post("/create", async (req, res) => {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(504).send("You don't have permission to create a new owner");
        }

        const { fullName, email, password } = req.body;

        bcrypt.genSalt(10, async function (err, salt) {
            if (err) return res.send(err.message);

            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message);

                try {
                    let owner = await ownerModel.create({
                        fullName,
                        email,
                        password: hash,
                    });

                    let token = generateToken(owner);

                    // Setting a signed cookie
                    res.cookie("ownerToken", token, { signed: true, httpOnly: true });

                    res.status(201).send(owner);
                } catch (error) {
                    res.status(500).send(error.message);
                }
            });
        });
    });
}



router.get("/admin",isOwner, function (req, res) {
    let success = req.flash("success");
    let error = req.flash("error");
    res.render("createproducts", { success, error });
});

router.get("/login",async function (req, res) {
    try {
        res.render("owner-login", { Owner: false, loggedIn: false });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/");
    }
});


router.post("/login", async function (req, res) {
    try {
        let { email, password } = req.body;
        let owner = await ownerModel.findOne({ email });

        if (!owner) {
            req.flash("error", "Incorrect Email or Password!");
            console.log("Owner not found.");
            return res.redirect("/owner/login");
        }

        bcrypt.compare(password, owner.password, function (err, result) {
            if (err) {
                req.flash("error", "An error occurred during authentication.");
                console.log("Error during password comparison:", err);
                return res.redirect("/owner/login");
            }

            if (result) {
                let token = generateToken(owner);

                // Setting a signed cookie
                res.cookie("ownerToken", token, { signed: true, httpOnly: true });

                console.log("Login successful. Token set:", token);
                req.flash("success", "Welcome Back Admin!");
                return res.redirect("/owner/admin");
            } else {
                req.flash("error", "Incorrect email or password.");
                console.log("Password did not match.");
                return res.redirect("/owner/login");
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        req.flash("error", error.message);
        res.redirect("/owner/login");
    }
});


router.post("/logout",function (req, res)
{
    // Clearing the signed cookie by setting its value to an empty string
    res.cookie("ownerToken", "", { signed: true, httpOnly: true, maxAge: 0 });
    res.redirect("/owner/login");
}
) ;


module.exports = router;
