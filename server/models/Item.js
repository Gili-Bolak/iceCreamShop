const mongoose = require("mongoose")

const ItemSchema = new mongoose.Schema(
    {
        code:{ 
            type:Number,
            required:true,
            unique:true,
            immutable:true
        },
        category: {
            type: String,
            enum: ["iceCream", "frozen", "hotDesserts", "yogurt"],
            required: true
        },
        description: {
            type: String
        },
        price: {
            type: Number,
            required:true
        },
        stock: {
            type: Number,
            default:50
        },
        image:{
            type:String
        }
    }, {
    timestamps: true
}
)

module.exports = mongoose.model('Item', ItemSchema)