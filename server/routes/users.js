const express = require("express");
const {UserModel, validateUser, validateLogin, genToken} = require("../models/userModel");
const bcrypt = require("bcrypt")
const {authToken} = require("../auth/authToken")
const router = express.Router();

router.get("/" , async(req,res)=> {

  try{
    let data = await UserModel
    .find({})
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.get("/usersInfo", authToken , async(req,res)=> {
  res.json({msg:"all good we after the middleware"})


})

router.post("/", async(req,res) => {

  let validBody = validateUser(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  try{
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10)
    await user.save();
    user.password = "*****"
    res.status(201).json(user);
  }
  catch(err){
    if(err.code == 11000) {
      return res.status(400).json({err:"Email already in system 😐", code:11000})
    }
    console.log(err)
    res.status(500).json({err:"err", err})
  }
})


router.delete("/:idDel",async(req,res) => {
  try{
    let idDel = req.params.idDel
    let data = await UserModel.deleteOne({_id:idDel});
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.put("/:idEdit",async(req,res) => {
  let validBody = validateUser(req.body);
  if(validBody.error){
    console.log(req.body);
    return res.status(400).json(validBody.error.details);
  }
  try{
    let idEdit = req.params.idEdit
    let data = await UserModel.updateOne({_id:idEdit},req.body);
    res.json(data);
  }
  catch(err){
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.post("/login", async(req,res) => {

  let validBody = validateLogin(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details);
  }
  let user = await UserModel.findOne({email:req.body.email})

  if(!user) {
    return res.status(401).json({mes:"User not found"})
  }
  let passwordValid = await bcrypt.compare(req.body.password, user.password) 
  if(!passwordValid) {
    return res.status(401).json({mes:"Password wrong"})
  }


  let newToken = genToken(user._id) 
  res.json({token: newToken})
})


module.exports = router;