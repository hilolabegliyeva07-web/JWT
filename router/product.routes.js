const { Router } = require("express")
const { getAllProducts, addProduct, getOneProduct, updateProduct, deleteProduct } = require("../controller/product.controller")
const authorization = require("../middleware/authorization")

const productRouter = Router()

productRouter.get("/get_all_products", getAllProducts)
productRouter.post("/add_product", authorization, addProduct)
productRouter.get("/get_one_product/:id", getOneProduct)
productRouter.put("/update_product/:id", updateProduct)
productRouter.delete("/delete_product/:id", deleteProduct)

module.exports = productRouter