const Item = require("../models/Item")


const getAllItem = async (req, res) => {
    const item = await Item.find().lean()
    if (!item?.length) {
        return res.json([])
    }
    res.json(item)
}


const getItemByCategory = async (req, res) => {
    const { category } = req.params
    if (!category) {
        return res.status(400).json({ message: 'category is required' })
    }

    
    const item = await Item.find({ category: category }).lean()

    if (!item?.length) {
        return res.json([])
    }
    res.json(item)
}


const createNewItem = async (req, res) => {
    const { code, category, description, price } = req.body

    if (!code || !category || !price) {
        return res.status(400).json({ message: 'fields code, category and price are required' })
    }

    const duplicate = await Item.findOne({ code: code }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate code" })
    }

    const newItem = await Item.create({ code, category, description, price, image: req.file.path })
    if (newItem) {
        return res.json(`item ${newItem.code} created`)
    }
    res.status(400).json({ message: 'Failed to create new item' })
}


const updateItem = async (req, res) => {

    const { _id, description, price } = req.body
    if (!_id || !price) {
        return res.status(400).json({ message: 'fields id and price are required' })
    }

    const updItem = await Item.findById(_id)
    if (!updItem) {
        res.status(400).json({ message: 'Item not found' })
    }

    updItem.description = description
    updItem.price = price
    if (req.file){
        updItem.image = req.file.path
    }
        
    const theUpdateItem = await updItem.save()
    res.json(`${theUpdateItem.code} updated`)
}



const deleteItem = async (req, res) => {
    const { _id } = req.params
    const delItem = await Item.findById(_id)
    if (!delItem) {
        return res.status(400).json({ message: 'Item not found' })
    }

    const del = await delItem.deleteOne()

    res.json(del)
}


module.exports = { getAllItem, getItemByCategory, createNewItem, updateItem, deleteItem }