const mongoose = require("mongoose")

const ItemForBasketSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }, {
    timestamps: true
}
)

module.exports = ItemForBasketSchema