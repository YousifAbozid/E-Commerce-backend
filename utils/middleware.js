export const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

export const errorHandler = (error, request, response, next) => {
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'token missing or invalid'
    })
  }

  next(error)
}