const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        productName: String,
        price: Number,
        discount: {
            type: Number,
            default: 0,
        },
        bgColor: String,
        panelColor: String,
        textColor: String,
        imageUrl: String

    }
);

module.exports = mongoose.model("products", productSchema);