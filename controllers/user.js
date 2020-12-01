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
        return response.status(401).json({ error: 'Invalid username or password' })
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
        response.status(404).json({ error: 'User not found' })
    }
})

// description: to update user profile data
// route: PUT api/users/profile
export const updateUserProfile = asyncHandler(async (request, response) => {
    // first extract the token from the request headers
    const token = getTokenFrom(request)

    // destructure the data from the request body
    const { name, email, password } = request.body
    
    // then decode the token to know the user id
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    // if the token is missing or invalid the code will stop exucting in the line above
    // and this generating an error, and errorHandler will respond with appropriate status code and error message
    
    // checks if the name is provided in the request and at least 4 characters
    if (name && name.length < 4) {
        return response.status(400).json({error : "Name length is shorter than 4 characters"})
    }

    // checks if the password is provided in the request and at least 4 characters
    if (password && password.length < 4) {
        return response.status(400).json({error : "Password length is shorter than 4 characters"})
    }
    
    // search for the user by his/her id because we will need his/her data
    const userToUpdate = await User.findById(decodedToken.id)

    // then generate salt rounds to hash the password, check the docs from here: https://www.npmjs.com/package/bcryptjs
    const saltRounds = await bcrypt.genSalt(10)

    // create an object with the data we want to update
    const updatedInfo = {
        name: name || userToUpdate.name,
        email: email || userToUpdate.email,
        password: password ? await bcrypt.hash(password, saltRounds) : userToUpdate.password
    }

    // then update the user data with the updated info
    const updatedUser = await User.findByIdAndUpdate(decodedToken.id, updatedInfo, { new: true })

    // if the user data updated successfully return with response his/her updated info
    if (updatedUser) {
        response.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
    } else {
        // if can't update the user respond with status code 400 bad request 
        response.status(400).json({ error: 'Can\'t update the user' })
    }
})

// description: to add new user
// route: POST api/users
export const addUser = asyncHandler(async (request, response) => {
    // first destructring name, email and password from the request body
    const { name, email, password } = request.body

    // checks if the name is provided in the request and at least 4 characters
    if (name.length < 4) {
        return response.status(400).json({error : "Name length is shorter than 4 characters"})
    }

    // checks if the email is provided
    if (!email) {
        return response.status(400).json({error : "Email should be provided"})
    }

    // checks if the password is provided in the request and at least 4 characters
    if (password.length < 4) {
        return response.status(400).json({error : "Password length is shorter than 4 characters"})
    }

    // if not then add new user to the database but first encrypt the password
    const saltRounds = await bcrypt.genSalt(10) // this for generating salt rounds, check the docs from here: https://www.npmjs.com/package/bcryptjs
    const passwordHash = await bcrypt.hash(password, saltRounds) // this create hash from password

    const user = await User.create({
        name,
        email,
        password: passwordHash
    })

    // checks if user created then send his/her data to the frontend
    if (user) {
        response.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
        // if something went wrong return with status code 400 bas request
        response.status(400).json({ error: 'invalid user data' })
    }
})