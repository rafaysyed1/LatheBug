const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: String,
        cart: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
        }],
        orders: {
            type: Array,
            default: []
        },
        contact: Number,
        imageUrl: String

    }
);

module.exports = mongoose.model("users", userSchema);