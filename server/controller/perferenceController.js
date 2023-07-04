const { PerferenceModel, validateArea } = require("../models/perferenceModel");
const {getDressById2} = require("./dressController")
const getPerferencees = async (req, res) => {
  try {
    let perferences = await PerferenceModel.find();
    res.send(perferences);
  } catch (error) {
    res.json({ eror: error });
  }
};
const getPerferenceById = async (req, res) => {
  try {
    let id = req.params.id;
    let perference = await PerferenceModel.findById(id);
    res.send(perference);
  } catch (error) {
    res.json({ error: error });
  }
};

const checkUserPerferenceByDress = async (req, res) => {
  try {
    let user = req.params.user;
    let dress = req.params.dress;
    let perference = await PerferenceModel.find({ user: user, dress: dress });
    console.log(res);
    res.json({
      ans: perference.length > 0,
      perference: perference.length > 0 ? perference[0] : null,
    });
  } catch (error) {
    res.json({ error: error });
  }
};
const deletePerference = async (req, res) => {
  try {
    let id = req.params.id;

    let perference = await PerferenceModel.findByIdAndDelete(id);
    res.send(perference + " deleted succesfully!!");
  } catch (error) {
    res.json({ error: error });
  }
};
const addPerference = async (req, res) => {
  try {
    let newPerference = new PerferenceModel(req.body);

    await newPerference.save();
    res.send("the new perference added successfully!");
  } catch (error) {
    res.json({ error: error });
  }
};
const updatePerference = async (req, res) => {
  try {
    let id = req.params.id;
    let newPerference = req.body;
    await PerferenceModel.findByIdAndUpdate(id, newPerference);

    res.send("the new perference updated successfully!");
  } catch (error) {
    res.json({ error: error });
  }
};

const getPerferencesByUser = async (req, res) => {
  try {
    let user = req.params.user;
    let perferences = await PerferenceModel.find({ user: user })
    // perferences = perferences.map(async(p)=>{
    //    let dress = await getDressById(p.dress)
    //    return {...p, dress:dress}
    //   })
    // console.log(res);
    res.json(perferences);
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports = {
  checkUserPerferenceByDress,
  getPerferencees,
  getPerferenceById,
  deletePerference,
  addPerference,
  updatePerference,
  getPerferencesByUser,
};
