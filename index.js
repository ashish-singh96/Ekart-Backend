import express from "express";
import dotenv from 'dotenv';
import fileUpload from "express-fileupload";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';

import routes from "./route/Route.js";

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

app.use(fileUpload({ useTempFiles: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;
const url = process.env.MONGOURL;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

app.use('/', routes);

mongoose.connect(url).then(() => {
    console.log("DB Connected!");
}).catch(error => console.log(error));

// Corrected part: pass the port as an argument to listen
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
