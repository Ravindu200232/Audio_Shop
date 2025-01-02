import mongoose from "mongoose";

const productShema =new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    }
})

const Product = mongoose.model("product",productShema);
export default Product;