const { DressModel, validateDress } = require("../models/dressModel");

const getDresses = async (req, res) => {
  try {
    let dresses = await DressModel.find()
      .lean()
      .populate("color")
      .populate("landlord")
      .populate("images")
      .populate("style")
      .populate("subArea");
    //   await DressModel.deleteMany({})
    //    dresses.forEach(async(dress) => {
    //    let ne  = dress
    //    ne.status = 0
    //    await DressModel.findByIdAndUpdate(ne._id, ne)
    //    });
    res.send(dresses);
  } catch (error) {
    console.log(error);
    res.json({ error });
  }
};
const getDressById = async (req, res) => {
  try {
    let id = req.params.id;
    let dress = await DressModel.findById(id)
      .lean()
      .populate("color")
      .populate("landlord")
      .populate("subArea")
      .populate("images");
    res.send(dress);
  } catch (error) {
    res.json({ error: error });
  }
};
const getDressById2 = async (id) => {
  try {
    let dress = await DressModel.findById(id)
      .lean()
      .populate("color")
      .populate("landlord")
      .populate("subArea")
      .populate("images");
    return dress;
  } catch (error) {
    res.json({ error: error });
  }
};

const getDressByUserId = async (req, res) => {
  try {
    let userId = req.params.userId;
    console.log(userId);
    let dresses = await DressModel.find({ landlord: userId })
      .lean()
      .populate("color")
      .populate("landlord")
      .populate("images")
      .populate("subArea");
    res.send(dresses);
  } catch (error) {
    res.json({ error: error });
  }
};

const deleteDress = async (req, res) => {
  try {
    let id = req.params.id;

    let dress = await DressModel.findByIdAndDelete(id);
    res.send(dress + " deleted succesfully!!");
  } catch (error) {
    res.json({ error: error });
  }
};

const addDress = async (req, res) => {
  console.log(req.body);

  // var obj = {
  //     description: req.body.description,
  //     landlord: req.body.landlord,
  //     price: req.body.price,
  //     size: req.body.size,
  //     style:req.body.style,
  //     uploadDate: req.body.uploadDate,
  //     color: req.body.color,
  //     subArea: req.body.subArea,
  //     images: req.body.images
  // }
  //     let newDress = new DressModel(obj)
  let validBody = validateDress(req.body);
  if (validBody.error) {
    console.log(validBody.error.details);
    return res.status(400).json(validBody.error.details);
  }
  try {
    let dress = new DressModel(req.body);
    await dress.save();
    res.status(201).json(dress);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: "err", err });
  }
};
const updateDress = async (req, res) => {
  try {
    console.log("dddddddddddddddddddddddddddddddddddddddddddddd");
    let id = req.params.id;
    let newDress = req.body;
    console.log(id, newDress);
    await DressModel.findByIdAndUpdate(id, newDress);

    res.send("the new dress updated successfully!");
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports = {
  getDresses,
  getDressById,
  deleteDress,
  addDress,
  updateDress,
  getDressByUserId,
  getDressById2
};
