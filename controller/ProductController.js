import product from "../model/ProductModel.js";
import {v2 as cloudinary} from 'cloudinary';
class ProductController {
  
  static insert_product = async (req, res) => {
    try {
        const { title, price, category, description } = req.body;

        if (req.files && req.files.image && req.files.otherImages) {
            const image = req.files.image;
            const otherImages = Array.isArray(req.files.otherImages) ? req.files.otherImages : [req.files.otherImages];
            
            // Upload main image
            const imageResult = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "Ekart/product"
            });

            // Upload other images
            const otherImageResults = await Promise.all(otherImages.map(async (otherImage) => {
                const result = await cloudinary.uploader.upload(otherImage.tempFilePath, {
                    folder: "Ekart/product"
                });
                return {
                    public_id: result.public_id,
                    url: result.secure_url,
                };
            }));

            // Create and save product
            const data = new product({
                image: {
                    public_id: imageResult.public_id,
                    url: imageResult.secure_url,
                },
                otherImages: otherImageResults,
                title,
                price,
                description,
                category,
            });

            await data.save();
            res.status(200).json({ message: "Data Inserted Successfully!" });
        } else {
            res.status(403).json({ message: "Please Check Fields" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
}


    
}
export default ProductController;