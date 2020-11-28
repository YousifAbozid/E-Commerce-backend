import products from '../data/products.js'

export const getProducts = (request, response) => {
    response.json(products)
}

export const getProduct = (request, response) => {
    const product = products.find(p => p._id === request.params.id)
    response.json(product)
}