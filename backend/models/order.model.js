import mongoose from "mongoose";

const orderSchema= new mongoose.Schema({
   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
   },
   products:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    }
   ]
})