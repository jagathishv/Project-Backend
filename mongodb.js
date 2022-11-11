const { MongoClient } = require("mongodb");

const mongo = {
    db: null,
    admin: null,
    orders: null,
    users: null,
    products:null,
    async connect() {
        const client = new MongoClient(process.env.DB_URL);
        await client.connect();
        this.db = await client.db(process.env.DB_Name);
        console.log(`db connected-${process.env.DB_Name}`);
        this.admin = this.db.collection("admin");
        this.orders = this.db.collection("orders");
        this.users = this.db.collection("users");
        this.products = this.db.collection("products");
    }
}

module.exports = mongo;