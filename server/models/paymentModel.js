const mongoose = require("mongoose");
const Joi = require("joi");

const paymentSchema = new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
  amount:Number,
  date:Date,
  isLandlord:Boolean,
  dress:{type:mongoose.Schema.Types.ObjectId,ref:'dress'},

 
})


exports.PaymentModel = mongoose.model("payments", paymentSchema);

exports.validatePayment = (_reqBody) => {
  let joiSchema = Joi.object({
    user: Joi.string().min(5).max(20).required(),
    amount:Joi.number().min(2).max(1000).required(),
    date:Joi.date().required(),
    isLandlord:Joi.boolean().required(),
    dress:Joi.string()
    

  })

  return joiSchema.validate(_reqBody);
}

