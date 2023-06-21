require("dotenv").config()

exports.config = {
    tokenSecret : process.env.SECRET_TOKEN,
    userDB: process.env.USER_DB,
    passDB : process.env.PASS_DB

}