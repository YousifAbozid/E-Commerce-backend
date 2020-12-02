import express from 'express'
import addOrderItem from '../controllers/order.js'

const router = express.Router()

router.post('/', addOrderItem)

export default router