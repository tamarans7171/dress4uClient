const {SubAreaModel, validateSubArea}=require('../models/subAreaModel')
const {Types}=require('mongoose')


const getSubAreas=async(req,res)=>{
    try {
        
     let subAreas=await  SubAreaModel.find();
     res.send(subAreas)
    } catch (error) {
        res.json({"eror":error})
    }

}
const getSubAreasByArea=async(req,res)=>{
    try {
        let id=req.params.id
     let subAreas=await SubAreaModel.find({"area":id});
     console.log(subAreas);
     res.send(subAreas)
    } catch (error) {
        res.json({"eror":error})
    }

}
const getSubAreaById=async(req,res)=>{

    try {
        let id=req.params.id
     let subArea= await SubAreaModel.findById(id);
     res.send(subArea)
    } catch (error) {
        res.json({"error":error})
    }

}
const deleteSubArea=async(req,res)=>{
    try {
        let id=req.params.id

     let subArea= await SubAreaModel.findByIdAndDelete(id);
     res.send(subArea+" deleted succesfully!!")
    } catch (error) {
        res.json({"error":error})
    }

}
const addSubArea=async(req,res)=>{
    try {
        let newSubArea=new subAreaModel(req.body) 

        await newSubArea.save()
        res.send("the new SubArea added successfully!")
    } catch (error) {
        res.json({"error":error})
    }

}
const updateSubArea=async(req,res)=>{
    try {
        let id=req.params.id;
        let newSubArea=(req.body) 
        await SubAreaModel.findByIdAndUpdate(id,newSubArea)

        res.send("the new SubArea updated successfully!")
    } catch (error) {
        res.json({"error":error})
    }

}

module.exports={getSubAreasByArea,getSubAreaById,getSubAreas,deleteSubArea,addSubArea,updateSubArea}
