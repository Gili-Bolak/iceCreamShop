const Basket = require("../models/Basket")


const getAllBaskets = async (req, res) => {
    const basket = await Basket.find().lean()
    if (!basket?.length) {
        return res.json([])
    }
    res.json(basket)
}

const getBasketsByUser = async (req, res) => {
    const { user } = req.params
    if (!user) {
        return res.status(400).json({ message: 'user id is required' });
    }
    try {
        const basket = await Basket.findOne({ user }).populate({
            path: 'items',
            populate: {
                path: 'item',
                select: 'description category price stock image'
            }
        });

        if (!basket || !basket.items.length) {
            return res.status(204).json(null);
        }

        res.json(basket);
    } catch (error) {
        console.error("Error occurred while fetching basket:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const createNewBasket = async (req, res) => {
    const { user } = req.body
    if (!user) {
        return res.status(400).json({ message: 'user id is required' })
    }

    const newBasket = await Basket.create({ user, items: [] })
    if (newBasket) {
        return res.json(newBasket)
    }
    res.status(400).json({ message: 'Failed to create new basket' })
}


const AddItemForBasket = async (req, res) => {
    const { user } = req.params
    const { item, quantity } = req.body

    if (!user || !item) {
        return res.status(400).json({ message: 'fileds are required' })
    }

    const newItem = {
        item: item,
        quantity: quantity
    }
    const updBasket = await Basket.findOne({ user: user })
    if (!updBasket) {
        const newBasket = await Basket.create({ user, items: [newItem] })

        if (newBasket) {
            return res.json(newBasket)
        }
        return res.status(400).json({ message: 'Failed to create new basket' })
    }

    const exsistItem = updBasket.items.find(f => f.item.toString() === item._id)

    if (exsistItem) {

        exsistItem.quantity = exsistItem.quantity + quantity
        const updateItem = await updBasket.save()
        return res.json(updateItem)
    }

    updBasket.items = [...updBasket.items, newItem]
    const theUpdateBasket = await updBasket.save()
    
    res.json(theUpdateBasket)
}


const UpdateQuantity = async (req, res) => {

    const { quantity } = req.body
    const { _id, item } = req.params

    if (!_id || !item) {
        return res.status(400).json({ message: 'id and item are required' })
    }

    const updBasket = await Basket.findOne({ _id: _id })
    if (!updBasket) {
        res.status(400).json({ message: 'Basket not found' })
    }

    const item1 = updBasket.items?.find(f => f.item.toString() === item)
    if (!item1) {
        res.status(400).json({ message: 'item not found' })
    }
    item1.quantity = quantity;
    const updateBasket = await updBasket.save()

    res.json(`${updateBasket} added`)
}



const DeleteItemFromBasket = async (req, res) => {

    const { _id, item } = req.params
    if (!_id || !item) {
        return res.status(400).json({ message: 'id and item are required' })
    }

    const updBasket = await Basket.findById(_id)
    if (!updBasket) {
        return res.status(400).json({ message: 'Basket not found' })
    }

    const item1 = updBasket.items?.find(f => f.item.toString() === item)
    if (!item1) {
        return res.status(400).json({ message: 'item not found' })
    }
    else {
        const items = updBasket.items?.filter(f => f.item.toString() != item)

        updBasket.items = items
        const updateBasket = await updBasket.save()
        return res.json(updateBasket)
    }

}


const DeleteBasket = async (req, res) => {
    const { _id } = req.params
    const delBasket = await Basket.findById(_id)

    if (!delBasket) {
        return res.status(400).json({ message: 'Basket not found' })
    }

    const del = await delBasket.deleteOne()

    res.json(del)
}


module.exports = { getAllBaskets, getBasketsByUser, createNewBasket, AddItemForBasket, UpdateQuantity, DeleteItemFromBasket, DeleteBasket }