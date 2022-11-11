const db = require("../mongodb")
const Joi = require("joi")


const registerSchema = Joi.object({
    FullName: Joi.string().min(4).max(20).required(),
    Email: Joi.string().required(),
    Password: Joi.string().min(4).max(15).required(),
    ConfirmPassword: Joi.ref("Password"),

});

const loginSchema = Joi.object({
    Email: Joi.string().required(),
    Password: Joi.string().min(4).max(15).required()
});

const helper = {
    validateRegister(user) {
        try {
            return registerSchema.validateAsync(user);
        } catch ({ details: [{ message }] }) {
            throw new Error(message);
        }
    },
    validateLogin(user) {
        try {
            return loginSchema.validateAsync(user);
        } catch ({ details: [{ message }] }) {
            throw new Error(message);
        }
    },

    findUserEmail(Email) {
        return db.users.findOne({ Email, active: true });
    },

    createuser(user) {
        return db.users.insertOne(user);
    },

    findAdminEmail(Email) {
        return db.admin.findOne({ Email });
    }
}

module.exports = helper