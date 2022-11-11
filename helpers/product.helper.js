const db = require("../mongodb")
const Joi = require("joi")
const { ObjectId } = require("mongodb")

const productSchema = Joi.object({
    ProductName: Joi.string().min(4).max(20).required(),
    Url: Joi.string().required(),
    Discription: Joi.string().min(4).max(300).required(),
    Price: Joi.number().required()

});

const producthelper = {
    createproduct(product) {
        return db.products.insertOne(product);
    },
    cupdate({ _id, ...body }) {
        return db.orders.findOneAndUpdate(
            { _id: ObjectId(_id) },
            { $set: { ...body,status:"Accepted" }},
            { returnDocument: "after" })
    },
    remove(_id) {
        return db.products.deleteOne({ _id: ObjectId(_id) })
    },
    
}

module.exports = producthelper