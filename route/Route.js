import express from 'express';
import ProductController from '../controller/ProductController.js';
import SignUpController from '../controller/SignUpController.js';
import EnquiryFormController from '../controller/EnquiryFormController.js';


const routes = express.Router();
//Product routing
routes.post('/product_insert', ProductController.insert_product);
routes.get('/get_product', ProductController.view_product);
routes.get('/edit_product/:id', ProductController.edit_product);
routes.put('/update_product/:id', ProductController.update_product);
routes.delete('/delete_product/:id', ProductController.delete_product);


//Register routing
routes.post('/register', SignUpController.register);
routes.post('/login', SignUpController.login);
routes.post('/logout', SignUpController.logout);


//Enquiry Form
routes.post('/enquiry', EnquiryFormController.insert_enquiry);
routes.get('/get_enquiry', EnquiryFormController.get_enquiry);

export default routes;
