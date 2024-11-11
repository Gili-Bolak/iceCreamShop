const mongoose = require("mongoose")
const ItemForBasket = require("./ItemForBasket")

const BasketSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        items: {
            type: [ItemForBasket],
            default:[]
        }
    }, {
    timestamps: true
}
)

module.exports = mongoose.model('Basket', BasketSchema)