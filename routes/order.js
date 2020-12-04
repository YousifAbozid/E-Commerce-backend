import express from "express"
import { addOrderItem, getOrderById } from "../controllers/order.js"

const router = express.Router()

router.post("/", addOrderItem)
router.get("/:id", getOrderById)

export default router