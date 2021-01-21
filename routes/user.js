import express from "express"
import {
    authUser,
    getUserProfile,
    updateUserProfile,
    addUser,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
} from "../controllers/user.js"

const router = express.Router()

router.get("/", getUsers)
router.post("/", addUser)
router.delete("/:id", deleteUser)
router.get("/:id", getUserById)
router.put("/:id", updateUser)
router.post("/login", authUser)
router.get("/profile", getUserProfile)
router.put("/profile", updateUserProfile)

export default router
