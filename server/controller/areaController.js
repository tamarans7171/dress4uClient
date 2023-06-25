const {AreaModel, validateArea}=require('../models/areaModel')


const getAreas=async(req,res)=>{
    try {
        
     let areas=await AreaModel.find({});
     res.send(areas)
    } catch (error) {
        res.json({ error: error });
    }

}

const getAreaById=async(req,res)=>{

    try {
        let id=req.params.id
     let area= await AreaModel.findById(id);
     res.send(area)
    } catch (error) {
        res.json({"error":error})
    }

}
const deleteArea=async(req,res)=>{
    try {
        let id=req.params.id

     let area= await AreaModel.findByIdAndDelete(id);
     res.send(area+" deleted succesfully!!")
    } catch (error) {
        res.json({"error":error})
    }

}
const addArea=async(req,res)=>{
    try {
        let newArea=new AreaModel(req.body) 

        await newArea.save()
        res.send("the new area added successfully!")
    } catch (error) {
        res.json({"error":error})
    }

}
const updateAreas=async(req,res)=>{
    try {
        let id=req.params.id;
        let newArea=(req.body) 
        await AreaModel.findByIdAndUpdate(id,newArea)

        res.send("the new area updated successfully!")
    } catch (error) {
        res.json({"error":error})
    }

}

module.exports={getAreas,getAreaById,deleteArea,addArea,updateAreas}
