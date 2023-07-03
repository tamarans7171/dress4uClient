const ImagesModel = require('../models/imagesModel');
const updateImages = async (req, res) => {
    try {
        let id = req.params.id;
        let newImages = req.body
        console.log(id, newImages);

        await ImagesModel.findByIdAndUpdate(id, newImages)
        res.send("the new images updated successfully!")
    } catch (error) {
        console.log(error);
        res.json({ "error": error })
    }

}

const deleteImages = async (req, res) => {
    try {
        let id = req.params.id;
        // await ImagesModel.deleteMany({})
        await ImagesModel.findByIdAndDelete(id)

        res.send("the new images deleted successfully!")
    } catch (error) {
        res.json({ "error": error })
    }

}


module.exports = { updateImages, deleteImages}