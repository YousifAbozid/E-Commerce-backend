import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import productsRoutes from './routes/products.js'
import homeRoutes from './routes/home.js'

dotenv.config() // to access environment variables from .env file
const app = express() // the actual express app
app.use(cors()) // to allow the frontend to access the backend

// routes
app.use('/', homeRoutes)
app.use('/api/products', productsRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))