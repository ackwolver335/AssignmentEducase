import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({

    fullName:{
        type:String,
        required:true,
    },
    phonenumber:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    company:{
        type: String
    }

});

//Export the model
const User = mongoose.model('User',userSchema);
export default User;