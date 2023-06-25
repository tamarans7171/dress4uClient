const { UserModel, validateLogin, genToken, validateUser } = require("../models/userModel");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  let user = await UserModel.findOne({ email: req.body.email });

  if (!user) {
    return res.status(401).json({ mes: "User not found" });
  }
  let passwordValid = await bcrypt.compare(req.body.password, user.password);
  if (!passwordValid) {
    return res.status(401).json({ mes: "Password wrong" });
  }
  let newToken = genToken(user._id);
  res.json({ token: newToken });
};

const getUsers = async (req, res) => {
  try {
    let users = await UserModel.find();
    res.send(users);
  } catch (error) {
    res.json({ error: error });
  }
};

const getUserInfo = async (req, res) => {
 
try{
  let user = await UserModel.findOne({_id:req.tokenData._id}, {password:0})
res.json(user)
}
catch(err){
  console.log(err)
  res.status(500).json({msg:"err",err})
}  
};
const getUserById = async (req, res) => {
  try {
    let id = req.params.id;
    let user = await UserModel.findById(id);
    res.send(user);
  } catch (error) {
    res.json({ error: error });
  }
};
const checkUserAble = async (req, res) => {
  // try {
  //   let user=req.params.user
  //   let dress=req.params.dress
  //     user = await UserModel.findById(user)
  //     let hours = moment().diff(moment(new Date()), 'hours');
  //     dress = paymentModel.find({dress:Types.ObjectId(dress),user:Types.ObjectId(user)})//ב24 שעות אחרונות!!!!!!!!!!!
  //             if((new Date(user.endDate)) > (new Date()) || dress.length > 0)
  //  res.send(true)
  //  else res.send(false)
  // } catch (error) {
  //     res.json({"error":error})
  // }
};
const deleteUser = async (req, res) => {
  try {
    let id = req.params.id;

    let user = await UserModel.findByIdAndDelete(id);
    res.send(user + " deleted succesfully!!");
  } catch (error) {
    res.json({ error: error });
  }
};

const addUser = async (req, res) => {
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    user.password = "*****";
    res.status(201).json(user);
  } catch (err) {
    if (err.code == 11000) {
      return res
        .status(400)
        .json({ err: "Email already in system 😐", code: 11000 });
    }
    console.log(err);
    res.status(500).json({ err: "err", err });
  }
  // try {
  //   let ans = await UserModel.find({ email: req.body.email });
  //   console.log(ans);
  //   if (ans.length > 0) {
  //     res.send("this email already exist!");
  //   } else {
  //     let newUser = new UserModel(req.body);
  //     await newUser.save().then((u) => {
  //       res.send(u);
  //     });
  //   }
  // } catch (error) {
  //   res.json({ error: error });
  // }
};

const updateUser = async (req, res) => {
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let idEdit = req.params.id;
    let data = await UserModel.updateOne({ _id: idEdit }, req.body);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
};

module.exports = {
  getUserById,
  getUsers,
  deleteUser,
  addUser,
  updateUser,
  login,
  getUserInfo
};
