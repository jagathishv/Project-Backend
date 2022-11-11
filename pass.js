const bcrypt = require("bcrypt");
async function pass(req, res, next) {
    try{
        const salt = await bcrypt.genSalt();
        user = await bcrypt.hash("12345", salt);
        console.log(user)
        next()
    }catch(err){

    }
}

module.exports = pass;
