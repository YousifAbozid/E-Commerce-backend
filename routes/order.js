import express from "express"
import { addOrderItem, getOrderById, updateOrderToPaid } from "../controllers/order.js"

const router = express.Router()

router.post("/", addOrderItem)
router.get("/:id", getOrderById)
router.put("/:id/pay", updateOrderToPaid)

export default router