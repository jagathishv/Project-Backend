const jwt = require("jsonwebtoken");
const authHelper = require("./helpers/auth.helper")

async function Tokenauth(req, res, next) {
    req.user = null
    try {
        if (req.headers && req.headers.authorization) {
            const [_, token] = req.headers.authorization.split(" ");
            const user = await jwt.verify(token, process.env.JWTpassword);
            if (user.role === "admin") {
                const admin = await authHelper.findAdminEmail(user.Email)
                if (admin) {
                    req.user = user
                    next();
                }
            }
            else if (user.role === "user") {
                const users = await authHelper.findUserEmail(user.Email)
                if (users) {
                    req.user = user
                    next();
                }
            }
            else {
                throw new Error("User doesn't exists")
            }
        } else {
            res.status(403).send("log in")
        }
    } catch (err) {
        res.status(403).send(err.message);
    }
}

module.exports = Tokenauth