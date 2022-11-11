const express = require("express");
const cors = require("cors")
const { config } = require("dotenv")
const mongo = require("./mongodb");
const token = require("./middleware")
const auth = require("./routers/auth.route")
const products = require("./routers/product.route")
const orders = require("./routers/order.route")
//server connection
const PORT = process.env.PORT || 5000
const app = express();
config();

(async () => {
    try {
        await mongo.connect()

        //middlewares
        app.use(cors())
        app.use(express.json())   //parse req.body to json

        //routes
        app.get("/", (_, res) => res.send("Welcome to Feedingkurtis"));
        app.get("/api/homeproduct", async (_, res) => {
            try {
                res.send(await mongo.products.find().toArray())
            } catch (err) {
                res.status(500).send(err.message)
            }
        })
        app.use("/api/auth", auth)
        app.use(token)
        app.use("/api", products)
        app.use("/api/orders", orders)


        app.listen(PORT, () => console.log("Port-", PORT))
    } catch (err) {
        console.log(err.message)
        //process.exit()
    }
})()
