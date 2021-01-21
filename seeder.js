import mongoose from "mongoose"
import dotenv from "dotenv"
import users from "./data/users.js"
import products from "./data/products.js"
import User from "./models/user.js"
import Product from "./models/product.js"
import Order from "./models/order.js"

dotenv.config() // to access environment variables from .env file

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

const importData = async () => {
    try {
        // first delete everything from the database
        await User.deleteMany()
        await Product.deleteMany()
        await Order.deleteMany()

        // then save all the users to the database
        const createdUsers = await User.insertMany(users)

        // select the first user which is an admin
        const adminUser = createdUsers[0]._id

        // add the admin to the products
        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser }
        })

        // save all the products to the database
        await Product.insertMany(sampleProducts)

        console.log("Data Imported Successfully!")
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

const destroyData = async () => {
    try {
        // destroy the database
        await User.deleteMany()
        await Product.deleteMany()
        await Order.deleteMany()

        console.log("Data Destroyed Successfully!")
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

if (process.argv[2] === "-d") {
    destroyData()
} else {
    importData()
}
