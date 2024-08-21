const mongoose = require('mongoose');

mongoose
.connect("mongodb+srv://smrafay1:rafay786@mydb.unufed0.mongodb.net")
.then(function ()
{
    console.log("Connected!")
})
.catch(function (error) {
    console.log(error);
})

module.exports = mongoose.connection;