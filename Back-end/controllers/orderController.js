import orderModel from "../models/orderModel.js";


export const create = async(req,res)=>{
    try{
        const {productID,userID,quantity,totalPrice,status}=req.body;
        const order = new orderModel({
            productID,userID,quantity,totalPrice,status
          });
          await order.save();
          res.status(200).json({message:"order placed successfully", order:order})
    }catch(err){
        res.status(500).json({message:"problem placing order",error:err})
    }
}

export const getOne = async(req,res)=>{
    try{
        const id = req.params.id;
        const order = await orderModel.findById(id);
        res.status(200).json({message:"order found!", order:order})
    }catch(err){
        res.status(500).json({message:"problem finding orders", error:err})
    }
}

export const getAll = async(req,res)=>{
    try{
        const orders = await orderModel.find()
        res.status(200).json({message:"orders fetched successfully", orders:orders})
    }catch(err){
        res.status(500).json({message:"problem fetching orders", error:err})
    }
}

export const update = async(req,res)=>{
    try{
        const id = req.params.id;
        const {status} = req.body;
        const order = await orderModel.findByIdAndUpdate({_id:id},{$set:{status:status}});
        res.status(200).json({message:"order updated successfully", message:order})
    }catch(err){
        res.status(500).json({message:"problem updating orders", error:err})
    }
}

export const deleteOrder = async(req,res)=>{
    try{
        const id = req.params.id;
        await orderModel.findByIdAndDelete(id);
        res.status(200).send("order deleted successfully")
    }catch(err){
        res.status(500).json({message:"problem deleting order", error:err})
    }
}