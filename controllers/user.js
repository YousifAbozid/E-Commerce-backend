import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'
import User from '../models/user.js'

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