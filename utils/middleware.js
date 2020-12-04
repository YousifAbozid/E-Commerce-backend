export const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'Unknown Endpoint' })
}

export const errorHandler = (error, request, response, next) => {
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Token missing or invalid' })
  } else if (error.name === 'ValidationError' && error.errors.email.path === 'email') {
    return response.status(400).json({ error: 'This email is already registered' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoError') {
    return response.status(400).json({ error: 'This email is already exist, use different email' })
  } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(404).send({ error: "Order not found" })
  }

  next(error)
}