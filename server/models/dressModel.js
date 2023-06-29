const mongoose = require("mongoose");
const Joi = require("joi");

const dressSchema = new mongoose.Schema({
  description:String,
  landlord:{type:mongoose.Schema.Types.ObjectId,ref:'users'},
  price:Number,
  size:Number,
  uploadDate:Date,
  endTime:Date,
  style:[{type:mongoose.Schema.Types.ObjectId,ref:'styles'}],
  color:{type:mongoose.Schema.Types.ObjectId,ref:'colors'},
  subArea:{type:mongoose.Schema.Types.ObjectId,ref:'subAreas'},
  images:{type:mongoose.Schema.Types.ObjectId,ref:'images'},
  viewCounter:Number,
  status:Number
})


exports.DressModel = mongoose.model("dresses", dressSchema);

exports.validateDress = (_reqBody) => {
  let joiSchema = Joi.object({
    description: Joi.string().min(5).max(30).required(),
    landlord: Joi.string().min(7).max(20).required(),
    price: Joi.string().min(0).required(),
    size: Joi.number().min(1).max(60).required(),
    uploadDate: Joi.string(),
    endTime: Joi.string(),
    style:Joi.array().items(Joi.string()),
    color: Joi.string().min(7).max(20).required(),
    subArea: Joi.string().min(7).max(20).required(),
    images:  Joi.string().min(7).max(20).required(),
    viewCounter:  Joi.number().default(0),
    status:  Joi.number().default(0),

  })

  return joiSchema.validate(_reqBody);
}

