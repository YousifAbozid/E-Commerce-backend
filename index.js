import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import middleware from './utils/middleware.js'
import productsRoutes from './routes/products.js'
import homeRoutes from './routes/home.js'
import userRoutes from './routes/user.js'

dotenv.config() // to access environment variables from .env file
const app = express() // the actual express app
app.use(cors()) // to allow the frontend to access the backend
app.use(express.json()) // to parse all incoming requests to json

// connecting to MongoDB
mongoose.connect(process.env.CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false 
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log(`Can't connect to MongoDB => ${error.message}`))

// routes
app.use('/', homeRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/users', userRoutes)

app.use(middleware.unknownEndpoint)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))