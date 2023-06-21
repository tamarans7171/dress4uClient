const mongoose = require("mongoose");
const Joi = require("joi");

const areaSchema = new mongoose.Schema({
  name:String,
})

exports.AreaModel = mongoose.model("areas", areaSchema);

exports.validateArea = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(20).required()
  })

  return joiSchema.validate(_reqBody);
}


