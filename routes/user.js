import express from 'express'
import { authUser, getUserProfile, updateUserProfile, addUser } from '../controllers/user.js'

const router = express.Router()

router.post('/', addUser)
router.post('/login', authUser)
router.get('/profile', getUserProfile)
router.put('/profile', updateUserProfile)

export default router