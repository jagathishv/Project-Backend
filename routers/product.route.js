const router = require("express").Router()
const { ObjectId } = require("mongodb")
const Joi = require("joi")
const db = require("../mongodb")
const helper =require("../helpers/product.helper")

const productSchema = Joi.object({
    ProductName: Joi.string().min(4).max(20).required(),
    Url: Joi.string().required(),
    Discription: Joi.string().min(4).max(300).required(),
    Price: Joi.number().required()

});

router.post("/addProduct", async (req, res) => {
    try {
        const product = await productSchema.validateAsync(req.body)
        if (product) {
            const data = await db.products.insertOne(product);
            res.send(data);
        }
        else {
            const err = ({ details: [{ message }] })
            throw new Error(err);
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})
router.get("/userslist", async (_, res) => {
    try {
        res.send(await db.users.find().toArray())
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.get("/productdata", async (_, res) => {
    try {
        res.send(await db.products.find().toArray())
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.get("/quick/:id", async (req, res) => {
    try {
        res.send(await db.products.findOne({ _id: ObjectId(req.params.id) }))
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

router.get("/productdata/:id", async (req, res) => {
    try {
        res.send(await db.products.findOne({ _id: ObjectId(req.params.id) }))
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})


router.put("/productdata/:id", async (req, res) => {
    try {
        let _id = req.params.id
        let body = req.body
         {
            const data = await helper.cupdate({ _id, ...body })
            res.send(data)
        }
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.delete("/productdata/:id", async (req, res) => {
    try {
        {
            const data = await helper.remove(req.params.id)
            res.send(data)
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})


module.exports = router