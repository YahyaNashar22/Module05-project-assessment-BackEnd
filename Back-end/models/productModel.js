import mongoose from "mongoose";
import slugify from "slugify";

const Schema = mongoose.Schema;

const productModel = new Schema({
title:{
    type:String,
    required:true
},
image:[{
    type:String,
    required:true
}],
price:{
    type:Number,
    required:true
},
description:{
    type:String,
    required:true
},
slug: {
    type: String,
    unique: true,
  },
},{timestamps:true}
)

productModel.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
  });

// Create a mongoose model named (Product) based on the (productModel) and export it
export default mongoose.model('Product', productModel)