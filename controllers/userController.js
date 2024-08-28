const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');

module.exports.registerUser = async function (req, res) {
    try {
        let { fullName, email, password } = req.body;

        let oldCreatedUser = await userModel.findOne({ email: email });

        if (oldCreatedUser){
            req.flash("error","You already have an account,Please login");
            return res.redirect("/");
        } 
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message);
                else {
                    let user = await userModel.create({
                        fullName,
                        email,
                        password: hash,
                    });

                    let token = generateToken(user);
                    res.cookie("Token", token);
                    req.flash("success","User created successfully")
                    res.redirect("/");
                }
            })
        })


    } catch (error) {
        res.status(501).json({
            "Error": error.message
        });
    }
}

module.exports.loginUser = async function (req, res) {
    let { email, password } = req.body;

    let user = await userModel.findOne({ email: email });
    if (!user) {
        req.flash("error","Email or password incorrect!");
       return res.redirect("/")
    }

    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token);
            return res.redirect("/shop");
        } else {
            req.flash("error","Incorrect email or password");
            return res.redirect("/");

        }
    })
}

module.exports.logout = function (req,res) {
    res.cookie("token"," ");
    res.redirect("/")
}