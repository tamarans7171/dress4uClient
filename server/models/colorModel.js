const mongoose = require("mongoose");
const Joi = require("joi");

const colorSchema = new mongoose.Schema({
  name:String,
})

exports.ColorModel = mongoose.model("colors", colorSchema);

exports.validateColor = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(10).required()
    })

  return joiSchema.validate(_reqBody);
}


