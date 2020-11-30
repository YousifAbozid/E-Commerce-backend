import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { generateToken, getTokenFrom } from '../utils/auth.js'
import User from '../models/user.js'

// description: to make the user login
// route: POST api/users/login
export const authUser = async (request, response) => {
    // first destructring email and password from the request body
    const { email, password } = request.body
    
    // then search for the user by his/her email in the database
    const user = await User.findOne({ email })

    // if user found compare his/her password he/she typed in the request body
    // with the passwordhash that has been stored in the database.
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.password)

    // if there is no user or the password incorrect return response with status code 401 unAuthorized
    if (!(user && passwordCorrect)) {
        return response.status(401).json({
        error: 'invalid username or password'
        })
    }

    // if the email and password are correct return response with an object contain the user data
    response.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
    })
}

// description: to get user profile data
// route: GET api/users/profile
export const getUserProfile = asyncHandler(async (request, response) => {
    // first extract the token from the request headers
    const token = getTokenFrom(request)
    
    // then decode the token to know the user id
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    // if the token is missing or invalid the code will stop exucting in the line above
    // and this generating an error, and errorHandler will respond with appropriate status code and error message
    
    // if the token found and valid search for the user in the database by his/her id
    const user = await User.findById(decodedToken.id).select('-password') // '-password' for exclude the password 

    // if user found in the database return user data
    if (user) {
        response.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        // if user not found return status code 404 not found
        response.status(404).json({ error: 'user not found' })
    }
})