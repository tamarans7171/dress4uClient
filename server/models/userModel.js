const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
  firstName:String,
  lastName:String,
  address:{
    city:String,
    street:String,
    numHouse:Number
  },
  password:String,
  phone:String,
  email:String,
  startDate:Date,
  endDate:Date
})

exports.UserModel = mongoose.model("users", userSchema);

exports.genToken = (_userId) => {
  let token = jwt.sign({_id:_userId}, "MYSECRETWORD", {expiresIn:"60mins"})
  return token
}

exports.validateUser = (_reqBody) => {
  let joiSchema = Joi.object({
    firstName: Joi.string().min(2).max(20).required(),
    lastName: Joi.string().min(2).max(20).required(),
    address: Joi.object({
      city: Joi.string().min(2).max(100),
      street: Joi.string().min(2).max(100),
      numHouse: Joi.number().max(1000),
    }).required(),
    phone: Joi.string().min(5).max(10).required(),
    password: Joi.string().min(6).max(30).required(),
    email: Joi.string().min(6).max(50).required(),
    startDate: Joi.string(),
    endDate: Joi.string()
  })

  return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(5).max(50).required(),
    password: Joi.string().min(5).max(30).required()
  })

  return joiSchema.validate(_reqBody);
}

