const mongoose = require("mongoose");
const Joi = require("joi");

const styleSchema = new mongoose.Schema({
  name:String,
})

exports.StyleModel = mongoose.model("styles", styleSchema);

exports.validateStyle = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(20).required()  })

  return joiSchema.validate(_reqBody);
}


