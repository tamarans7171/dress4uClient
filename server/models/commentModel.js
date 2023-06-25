const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    dress:{type:mongoose.Schema.Types.ObjectId,ref:'dress'},
    nameToPublication:String,
    content:String,
    date:Date,
    numStars:Number,
    images:{type:mongoose.Schema.Types.ObjectId,ref:'images'}
})

exports.CommentModel = mongoose.model("comments", commentSchema);

exports.validateComment = (_reqBody) => {
  let joiSchema = Joi.object({
    dress:Joi.string().min(10).max(30).required(),
    nameToPublication:Joi.string().min(2).max(30).required(),
    content:Joi.string().min(2).max(100).required(),
    date:Joi.date().required(),
    numStars:Joi.number().min(0).max(5),
    images:Joi.string().min(5).max(30).required(),
    })

  return joiSchema.validate(_reqBody);
}


