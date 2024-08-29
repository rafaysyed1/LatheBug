const express = require('express');
const router = express.Router();
const isOwner = require("../middleware/isOwner");
const ownerModel = require("../models/ownerModel");
//Only in development mode 
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
    res.render("createproducts",{success,error});
});

router.get("/login",async function (req,res) {
   try {

    res.render("owner-login",{Owner:false});
    let {email,password } = req.body;
    let owner = await ownerModel.findOne({email : email});
    if(!owner){
        req.flash("error","Inccorrect Email or Password!");
        res.redirect("/");
    }
    bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
            req.flash("success","Welcome Back!");
            return res.redirect("/owner/admin");
        } else {
            req.flash("error","Incorrect email or password");
            return res.redirect("/");
           
        }
        
    })
   } catch (error) {
      req.flash("error",error.message);
   }
    

    
})


module.exports = router;
