import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import mongoose from "mongoose"
import { errorHandler, unknownEndpoint } from "./utils/middleware.js"
import productsRoutes from "./routes/products.js"
import homeRoutes from "./routes/home.js"
import userRoutes from "./routes/user.js"
import orderRoutes from "./routes/order.js"

dotenv.config() // to access environment variables from .env file
const app = express() // the actual express app
app.use(cors()) // to allow the frontend to access the backend
app.use(express.json()) // to parse all incoming requests to json

// ==> start using morgan logger
// this is the tiny configuration for morgan how looks like in string below:
// ":method :url :status :res[content-length] - :response-time ms"

if (process.env.NODE_ENV === "development") {
    app.use(
        morgan(
            ":method :url :status :res[content-length] - :response-time ms :POST-data"
        )
    )
    // also you can type morgan('dev') it will print something similar to that
}

/*
to create a token write as follow :
morgan.token('body', (req, res) => JSON.stringify(req.body))
and without JSON.stringify() it will print [Object Object] , JSON.stringify() fixes that.
for other resources visit : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify
OR look at the original documentation for morgan here : https://github.com/expressjs/morgan#morgan
*/
morgan.token("POST-data", (req, res) => JSON.stringify(req.body))
// ==> end using morgan logger

// connecting to MongoDB
mongoose
    .connect(process.env.CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) =>
        console.log(`Can't connect to MongoDB => ${error.message}`)
    )

// routes
app.use("/", homeRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)

// route to get paypal client id, also it's to short so I'll put it here in one single line
app.get("/api/config/paypal", (request, response) =>
    response.send(process.env.PAYPAL_CLIENT_ID)
)

// for middlewares
app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
