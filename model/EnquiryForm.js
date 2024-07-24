import mongoose  from "mongoose";
const enquiryForm = new mongoose.Schema({
         name:{
            type:String,
            required:true
         },
         email:{
            type:String,
            required:true
         },
         mobile:{
            type:String,
            required:true
         },
         message:{
            type:String,
            required:true
         }
});

const enquiry = mongoose.model('enquiry', enquiryForm);
export default enquiry;