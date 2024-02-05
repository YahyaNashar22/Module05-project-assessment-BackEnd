import {} from "body-parser";
import  Product from "../models/productModel.js";
import fs from "fs"

function removeImage(image) {
    fs.unlinkSync("images/" + image, (err) => {
      if (err) {
        console.log(`we can't delete the image`);
      } else {
        console.log("image deleted");
      }
    });
  }

export const getAll =  async (req, res) => {
 try{
    const products = await Product.find();
    res.status(200).json({message:"products fetched successfully", products:products})
 }catch(err){
    res.status(500).json({message:"error retrieving products", error:err})
 }}

export const getOne = async (req, res) => {
    const slug = req.params.slug;
    try {
      const product = await Product.findOne({ slug: slug });
  
      if (product) {
        return res.json({
          message: "Fetched one product",
          fetchedProduct: product,
        });
      } else {
        return res.status(404).json({ error: "Product Not Found!" });
      }
    } catch (err) {
      res.status(500).json({ error: "Internal server error!" });
    }
  };

export const deleteProduct = async (req, res) => {
        const slug = req.params.slug;
        try {
          const product = await Product.findOneAndDelete({ slug: slug });
          if (product) {
            if (product.image) {
              product.image.map((images) => removeImage(images));
            }
            return res.status(200).json({ message: "deleted successfully !" });
          } else {
            return res.status(404).json({ message: "product not found" });
          }
        } catch (err) {
          res.status(500).json({ message: "error deleting product", error: err });
        }
      };

export const create =  async (req, res) => {
    const {title, price, description} = req.body;
    const images=req.files.map(image => image.path);
        try{
         const product = await Product.create({
            title, price, description, image:images});
            res.status(200).json({message:"product created successfully", product:product})
         }catch(err){
           res.status(500).json({message:"error creating product", error:err})
        }}

export const updateProduct = async (req, res) => {
            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
              return res.status(404).json({ error: "No such product" });
            }
          
            try {
              const {
                title,price,description
              } = req.body;
              const images = req.files ? req.files.map((image) => image.filename) : null;
          
              if (req.files) {
                await Product.findByIdAndUpdate(
                  { _id: id },
                  {
                    $set: {
                        title:title,
                        price:price,
                        description:description,
                        image:images
                    },
                  }
                );
              } else {
                await Product.findByIdAndUpdate(
                  { _id: id },
                  {
                    $set: {
                        title:title,
                        price:price,
                        description:description,
                        
                    },
                  }
                );
              }
              return res.status(200).json({ message: "Product updated successfully" });
            } catch (err) {
              console.log(err);
              res.status(500).json({ error: "Trouble updating Product info" });
            }
          };


export const searchProduct = async (req, res) => {
            try {
              const { search } = req.body;
              const searchRegex = new RegExp(search, "i");
              const foundProducts = await Product.find({
                title: searchRegex,
              })
              if (!foundProducts || foundProducts.length == 0) {
                return res.status(404).send(" no more products to show !");
              }
              res
                .status(200)
                .json({ message: " products found !", products: foundProducts });
            } catch (err) {
              res
                .status(500)
                .json({ message: "error searching for product", error: err });
            }
          };