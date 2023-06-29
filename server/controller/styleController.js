const {StyleModel, validateStyle} = require('../models/styleModel')


const getStyles = async (req, res) => {
    try {
        
        let styles = await StyleModel.find();
        res.send(styles)
    } catch (error) {
        res.json({ "eror": error })
    }

}
const getStyleById = async (req, res) => {

    try {
        let id = req.params.id
        let style = await StyleModel.findById(id);
        res.send(style)
    } catch (error) {
        res.json({ "error": error })
    }

}
const deleteStyle = async (req, res) => {
    try {
        let id = req.params.id

        let style = await StyleModel.findByIdAndDelete(id);
        res.send(style + " deleted succesfully!!")
    } catch (error) {
        res.json({ "error": error })
    }

}
const addStyle = async (req, res) => {
    try {
        let newStyle = new StyleModel(req.body)

        await newStyle.save()
        res.send("the new style added successfully!")
    } catch (error) {
        res.json({ "error": error })
    }

}
const updateStyle = async (req, res) => {
    try {
        let id = req.params.id;
        let newStyle = (req.body)
        await StyleModel.findByIdAndUpdate(id, newStyle)

        res.send("the new style updated successfully!")
    } catch (error) {
        res.json({ "error": error })
    }

}

module.exports = { getStyles, getStyleById, deleteStyle, addStyle, updateStyle }
