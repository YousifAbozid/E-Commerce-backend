import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import { getTokenFrom } from "../utils/auth.js"
import Product from "../models/product.js"
import User from "../models/user.js"

export const getProducts = (request, response) => {
    Product.find({})
        .then((data) => response.json(data))
        .catch(() =>
            response.status(404).json({ message: "Products not found" })
        )
}

export const getProduct = (request, response) => {
    Product.findById(request.params.id)
        .then((data) => response.json(data))
        .catch(() =>
            response.status(404).json({ message: "Product not found" })
        )
}

export const deleteProduct = asyncHandler(async (request, response) => {
    // first extract the token from the request headers
    const token = getTokenFrom(request)

    // then decode the token to know the user id
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    // if the token is missing or invalid the code will stop exucting in the line above
    // and this generating an error, and errorHandler will respond with appropriate status code and error message

    // search for the user
    const user = await User.findById(decodedToken.id)

    // checks if the user is not an admin
    if (!user.isAdmin) {
        response
            .status(401)
            .json({ error: "Unauthorized, you are not an admin" })
    } else {
        const product = await Product.findById(request.params.id)
        if (product) {
            await product.remove()
            response.json({ message: "Product Removed" })
        } else {
            response.status(404).json({ message: "Product not found" })
        }
    }
})
