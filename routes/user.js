import express from 'express'
import { authUser, getUserProfile } from '../controllers/user.js'

const router = express.Router()

router.post('/login', authUser)
router.get('/profile', getUserProfile)

export default router