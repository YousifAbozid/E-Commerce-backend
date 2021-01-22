import express from "express"
import {
    getProducts,
    getProduct,
    deleteProduct,
    createProduct,
    updateProduct,
} from "../controllers/products.js"

const router = express.Router()

router.get("/", getProducts)
router.post("/", createProduct)
router.get("/:id", getProduct)
router.delete("/:id", deleteProduct)
router.put("/:id", updateProduct)

export default router
