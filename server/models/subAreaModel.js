const mongoose = require("mongoose");
const Joi = require("joi");

const subareaSchema = new mongoose.Schema({
  name:String,
  area:{type:mongoose.Schema.Types.ObjectId,ref:'area'}
})

exports.SubAreaModel = mongoose.model("subAreas", subareaSchema);

exports.validateSubArea = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(20).required(),
    area:Joi.string().min(7).max(20).required(),
  })

  return joiSchema.validate(_reqBody);
}


