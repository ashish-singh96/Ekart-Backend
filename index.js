import express from "express";
import dotenv from 'dotenv';
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors'

const app = express();
app.use(fileUpload({useTempFiles:true}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());


dotenv.config();
const port = process.env.PORT || 3000;
const url = process.env.MONGOURL;

mongoose.connect(url).then(()=>{
    console.log("DB Connected!")
}).catch(error =>console.log(error));

app.listen(()=>{
    console.log(`Server running at ${port}`)
})

