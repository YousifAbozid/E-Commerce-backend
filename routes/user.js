import express from 'express'
import { authUser, getUserProfile, addUser } from '../controllers/user.js'

const router = express.Router()

router.post('/', addUser)
router.post('/login', authUser)
router.get('/profile', getUserProfile)

export default router