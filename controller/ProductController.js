import product from "../model/ProductModel.js";
import { v2 as cloudinary } from 'cloudinary';
import objectId from 'objectid';
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
        const otherImagesResults = await Promise.all(otherImages.map(async (otherImages) => {
          const result = await cloudinary.uploader.upload(otherImages.tempFilePath, {
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
          otherImages: otherImagesResults,
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


  static view_product = async (req, res) => {
    try {
      const data = await product.find();
      if (data) {
        res.status(200).json({ message: "Data get SuccessFully", data });
      } else {
        res.status(403).json({ message: "Data not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }


  static edit_product = async (req, res) => {
    try {
      const id = req.params.id;
      if (objectId.isValid(id)) {
        const data = await product.findById({ _id: id });
        res.status(200).json({ message: "Data Get Successfully!", data });
      } else {
        res.status(403).json({ message: "ID not correct!" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }


  static update_product = async (req, res) => {
    try {
      const { title, price, category, description } = req.body;
      const id = req.params.id;
      if (objectId.isValid(id)) {
        if (req.files) {
          if (req.files.image && req.files.otherImages) {
            const image = req.files.image;
            const imageResult = await cloudinary.uploader.upload(
              image.tempFilePath,
              {
                folder: "Ekart/product"
              }
            );

            const otherImages = req.files.otherImages;
            const other = [];

            if (otherImages.length >= 2) {
              for (let i = 0; i < otherImages.length; i++) {
                const otherImagesResults = await cloudinary.uploader.upload(
                  otherImages[i].tempFilePath,
                  {
                    folder: "Ekart/product"
                  }
                )
                other.push({
                  public_id: otherImagesResults.public_id,
                  url: otherImagesResults.secure_url,
                })
              }
            } else {
              const otherImagesResults = await cloudinary.uploader.upload(
                otherImages.tempFilePath,
                {
                  folder: "Ekart/product"
                }
              );
              other.push({
                public_id: otherImagesResults.public_id,
                url: otherImagesResults.secure_url,
              })
            }

            const data = await product.findByIdAndUpdate({_id:id},
              {
                image: {
                  public_id: imageResult.public_id,
                  url: imageResult.secure_url
                },
                otherImages: other,
                title: title,
                price: price,
                description: description,
                category: category,
              }
            )
            await data.save();
            res.status(200).json({ message: "Data Update Successfully!" });

          }
        } else {
          res.status(403).json({ message: "Empty Fields!" });
        }
      } else {
        res.status(403).json({ message: "ID not correct!" });
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }

  static delete_product = async (req, res) => {
    try {
      const id = req.params.id;
      if(objectId.isValid(id)){
        const data  = await product.findById({_id:id});

        const image = data.image.public_id;

        if(image){
          await cloudinary.uploader.destroy(image);
        }

        const otherImages = data.otherImages;
        if(otherImages){
           for(let i =0 ;i<otherImages.length;i++){
            const id = otherImages[i].public_id;

            if(id){
              await cloudinary.uploader.destroy(id);
            }
           }
        }
        await product.findByIdAndDelete({_id:id});
        res.status(200).json({message:"Product Delete Successfully!"});
      }else{
        res.status(403).json({message:"Internal Server Error!"});
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
    }
  }



}
export default ProductController;