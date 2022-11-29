import mongoose, { mongo } from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId : {type : String, require : true},
    products : [
        {
            productId : {require : true, type : String},
            quantity : { require : true, type : Number, default : 1}
        }
    ], 
    amount : {type : Number, require : true},
    address : {type : Object, require : true},
    status : {type : String, default : 'pending'}
},{timestamps : true});

module.exports = mongoose.model("Order", OrderSchema);