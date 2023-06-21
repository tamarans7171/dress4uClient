const mongoose = require("mongoose");
const Joi = require("joi");

const imagesSchema = new mongoose.Schema({
  name:String,
})

exports.ImagesModel = mongoose.model("images", imagesSchema);

exports.validateImages = (_reqBody) => {
  let joiSchema = Joi.object({
    name: Joi.string().min(2).max(20).required()  })

  return joiSchema.validate(_reqBody);
}


