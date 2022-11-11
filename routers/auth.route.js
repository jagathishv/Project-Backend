const router = require("express").Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const db = require("../mongodb")
const helper = require("../helpers/auth.helper")


router.post("/register", async (req, res) => {
    try {
        // Data Validation
        const user = await helper.validateRegister(req.body);
        delete user.ConfirmPassword

        // User Exists Validation
        const userExists = await helper.findUserEmail(user.Email);
        if (userExists)
            return res.status(400).send({ error: "User already exists" });

        // Generate Password Hash
        const salt = await bcrypt.genSalt();
        user.Password = await bcrypt.hash(user.Password, salt);

        // Insert User
        const data = await helper.createuser({ ...user, role: "user", active: true, date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString() });

        res.send(data);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}
);

router.post("/ulogin", async (req, res) => {
    try {
        // Data Validation
        const user = await helper.validateLogin(req.body);
        

        // User Exists Validation
        const dbuser = await helper.findUserEmail(user.Email);
        if (!dbuser)
            return res.status(400).send({ error: "User doesn't exists" });

        // Password Validation
        const isSame = await bcrypt.compare(user.Password, dbuser.Password);
        if (!isSame) return res.status(401).send({ error: "Password Mismatch" });

        // Generate Auth Token
        const authToken = await jwt.sign(
            {
                _id: dbuser._id,
                Email: dbuser.Email,
                role: dbuser.role
            },
            process.env.JWTpassword,
            { expiresIn: "10h" }
        );

        res.send({ authToken });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}
);

router.post("/alogin", async (req, res) => {
    try {
        // Data Validation
        const admin = await helper.validateLogin(req.body);

        // User Exists Validation
        const dbadmin = await helper.findAdminEmail(admin.Email);
        //console.log(dbadmin)
        if (!dbadmin)
            return res.status(400).send({ error: "Admin doesn't exists" });

        // Password Validation
        const isSame = await bcrypt.compare(admin.Password, dbadmin.Password);
        if (!isSame) return res.status(401).send({ error: "Password Mismatch" });

        // Generate Auth Token
        const authToken = await jwt.sign(
            {
                _id: dbadmin._id,
                Email: dbadmin.Email,
                role: dbadmin.role
            },
            process.env.JWTpassword,
            { expiresIn: "10h" }
        );

        res.send({ authToken, dbadmin });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
}
)

module.exports = router