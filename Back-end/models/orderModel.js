import mongoose from "mongoose";

const Schema = mongoose.Schema;

const orderModel = new Schema({

status:{
    type:String,
    required:true
},
productID:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
}],
userID:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserSchema",
    required: true,
},
quantity:{
    type:Number,
    required: true
},
totalPrice:{
    type:Number,
    required:true,
}

},{timestamps:true})

export default mongoose.model('Order', orderModel)