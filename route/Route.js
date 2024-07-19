import express from 'express';
import ProductController from '../controller/ProductController.js';


const routes = express.Router();

routes.post('/product_insert', ProductController.insert_product);

export default routes;
