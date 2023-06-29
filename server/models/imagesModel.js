const mongoose = require("mongoose");
const Joi = require("joi");

const imagesSchema = new mongoose.Schema({
  imgCollection:{
    type:Array
  },
})

module.exports = mongoose.model("images", imagesSchema);




