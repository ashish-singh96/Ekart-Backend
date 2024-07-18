import product from "../model/ProductModel";
import {v2 as cloudinary} from 'cloudinary';
class ProductController {
  
    static insert_product = async (req, res) => {
        try {
            const {title, price, category, description} = req.body;
             if(req.files){
                   if(req.files.image && req.files.otherImage){
                      const image = req.files.image;
                      const imageResult = await cloudinary.uploader.upload(
                        image.tempFilePath,
                        {
                            folder:"Ekart/product"
                        }
                      );

                      
                   }
             }else{
                res.status(403).json({message:"Please Check Fields"});
             }
        } catch (error) {
          console.log(error);
          res.status(500).json({message:"Internal Server Error!"});   
        }
    }
}
export default ProductController;