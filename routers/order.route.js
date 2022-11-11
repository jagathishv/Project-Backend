const router = require("express").Router()
const { ObjectId } = require("mongodb")
const db = require("../mongodb")
const helper = require("../helpers/product.helper")

router.post("/payment", async (req, res) => {
    try {
        const data = await db.orders.insertOne({
            ...req.body, Uemail: req.user.Email, date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(), status: "pending"
        })
        res.send(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get("/payment", async (_, res) => {
    try {
        res.send(await db.orders.find().toArray())
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.get("/myorders", async (req, res) => {
    try {
        const data = await db.orders.find({ Uemail: req.user.Email }).toArray()
        res.send(data)
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.put("/statusupdate/:id", async (req, res) => {
    try {
        let _id = req.params.id
        let body = req.body
        if (body.status === "pending") {
            const data = await helper.cupdate({ _id, ...body })
            res.send(data)
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})



// router.put("/statusupdate/:id", async (req, res) => {
//     const _id = req.params.id
//     const body = req.body
//     try {
//         console.log(_id)
//         const data = await db.orders.findOneAndUpdate(
//             { _id: ObjectId(_id) },
//             { $set: { ...body, status: "Accepted" } },
//             { returnDocument: "after" })
//         res.send(data)
//     } catch (err) {
//         res.status(500).send(err.message)
//     }
// })




module.exports = router