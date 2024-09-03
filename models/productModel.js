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
        image: Buffer,
        popularity: {
            type: Number,
            default : 0
        },
       

    },
    { timestamps: true }
)

module.exports = mongoose.model("products", productSchema);