const {PaymentModel, validatePayment}=require('../models/paymentModel')

const getPayments=async(req,res)=>{
    try {
        
     let payments=await  PaymentModel.find();
    //  let payments=await  PaymentModel.deleteMany({});
     res.send(payments)
    } catch (error) {
        res.json({"eror":error})
    }

}
const getPaymentById=async(req,res)=>{

    try {
        let id=req.params.id
     let payment= await PaymentModel.findById(id);
     res.send(payment)
    } catch (error) {
        res.json({"error":error})
    }

}
const checkPermitionDress=async(req,res)=>{
    let now = new Date()
    now.setMonth(now.getMonth() - 1)
    try {
        let idDress=req.params.idDress
        let idUser=req.params.idUser
        let payment= await PaymentModel.find({user:idUser,dress:idDress,isLandlord:false,date:{ $gte:now } })
        res.send(payment.length>0)

    } catch (error) {
        res.json({"error":error})
    }

}
const checkPermitionComment=async(req,res)=>{
    let now = new Date()
    now.setMonth(now.getMonth() - 6)
    try {
        let idDress=req.params.idDress
        let idUser=req.params.idUser
        let payment= await PaymentModel.find({user:idUser,dress:idDress,isLandlord:false,date:{ $gte:now } })
        res.send(payment.length>0)

    } catch (error) {
        res.json({"error":error})
    }

}
const deletePayment=async(req,res)=>{
    try {
        let id=req.params.id

     let payment= await PaymentModel.findByIdAndDelete(id);
     res.send(payment+" deleted succesfully!!")
    } catch (error) {
        res.json({"error":error})
    }

}
const addPayment=async(req,res)=>{
    try {
        let newPayment=new PaymentModel(req.body) 
console.log(newPayment);
        await newPayment.save()
        res.send("the new Payment added successfully!")
    } catch (error) {
        res.json({"error":error})
    }

}
const updatePayment=async(req,res)=>{
    try {
        let id=req.params.id;
        let newPayment=(req.body) 
        await PaymentModel.findByIdAndUpdate(id,newPayment)

        res.send("the new Payment updated successfully!")
    } catch (error) {
        res.json({"error":error})
    }

}

module.exports={getPaymentById,getPayments,deletePayment,addPayment,updatePayment,checkPermitionDress, checkPermitionComment}
