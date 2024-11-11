const express = require("express")
const router = express.Router()
const itemController = require("../controllers/itemController")
const managerJWT = require("../middleware/managerJWT")
const verifyJWT = require("../middleware/verifyJWT")
const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + ".jpg")
    }
})

const upload = multer({ storage: storage })




router.get("/", itemController.getAllItem)
router.get("/:category", itemController.getItemByCategory)
router.post("/", managerJWT,upload.single('image'), itemController.createNewItem)
router.put("/:_id", managerJWT,upload.single('image'), itemController.updateItem)
router.put("/:_id/stock", verifyJWT, itemController.updateStock)
router.delete("/:_id", managerJWT, itemController.deleteItem)


module.exports = router