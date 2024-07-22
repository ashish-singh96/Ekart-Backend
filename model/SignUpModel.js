import mongoose from "mongoose";

const SignUpModel = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    cpassword:{
        type:String,
        required:true,
    }
});
const signup = mongoose.model('signup', SignUpModel);
export default signup;