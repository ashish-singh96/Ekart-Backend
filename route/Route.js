import express from 'express';
import ProductController from '../controller/ProductController.js';


const routes = express.Router();

routes.post('/product_insert', ProductController.insert_product);
routes.get('/get_product', ProductController.view_product);
routes.get('/edit_product/:id', ProductController.edit_product);

export default routes;
