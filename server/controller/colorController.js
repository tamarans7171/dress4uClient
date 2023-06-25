const {ColorModel, validateColor}=require('../models/colorModel')

const getColors=async(req,res)=>{
    try {
        
     let colors=await  ColorModel.find();
     res.send(colors)
    } catch (error) {
        res.json({"eror":error})
    }

}
const getColorById=async(req,res)=>{

    try {
        let id=req.params.id
     let color= await ColorModel.findById(id);
     res.send(color)
    } catch (error) {
        res.json({"error":error})
    }

}
const deleteColor=async(req,res)=>{
    try {
        let id=req.params.id

    //  let color= await ColorModel.deleteMany({});
     let color= await ColorModel.findByIdAndDelete(id);
     res.send(color+" deleted succesfully!!")
    } catch (error) {
        res.json({"error":error})
    }

}
const addColor=async(req,res)=>{
    try {
        let newColor=new ColorModel(req.body) 

        await newColor.save()
        res.send("the new color added successfully!")
    } catch (error) {
        res.json({"error":error})
    }

}
const updateColor=async(req,res)=>{
    try {
        let id=req.params.id;
        let newColor=(req.body) 
        await ColorModel.findByIdAndUpdate(id,newColor)

        res.send("the new color updated successfully!")
    } catch (error) {
        res.json({"error":error})
    }

}

module.exports={getColorById,getColors,deleteColor,addColor,updateColor}
