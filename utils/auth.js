import jwt from 'jsonwebtoken'

// to generate a token
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// to extract the token from the headers
export const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}