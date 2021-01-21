import Product from "../models/product.js"

export const getProducts = (request, response) => {
    Product.find({})
        .then((data) => response.json(data))
        .catch(() =>
            response.status(404).json({ message: "products not found" })
        )
}

export const getProduct = (request, response) => {
    Product.findById(request.params.id)
        .then((data) => response.json(data))
        .catch(() =>
            response.status(404).json({ message: "product not found" })
        )
}
