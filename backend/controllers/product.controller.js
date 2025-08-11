import Product from "../models/product.model.js";
import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
export const getAllProducts = async(req , res) =>{
    try{

        const products= await Product.find({});//find all the products
        res.json({products});


    }catch(error){
        console.log("Error in getAllProducts controller",error.message);
        return res.status(500).json({message:"Some error ",message:error.message});

    }
}

export const createProducts= async(req,res) =>{
    try{
        const {name,description,price,image,category}= req.body;
        let cloudinaryReponse = null 
        
        //if user provides image
        if(image){
         cloudinaryReponse =  await cloudinary.uploader.upload(image,{folder:"products"});


        }

        const product= await Product.create({
            name,
            description,
            price,
            image:cloudinaryReponse?.secure_url ?cloudinaryReponse.secure_url:"",
            category
        })

        res.status(201).json(product);

        

    }catch(error){
        console.log("Error in add products controller");

        return res.status(500).json({ message: "Error in add products controller", error: error.message });

    }
}

export const getFeaturedProducts = async(req,res) =>{
    try{
        let featuredProducts = await redis.get("featured_products");
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts));//json parse because redis store data in the form of string

        }

        //if not in redis fetch it from mongo db
        // the lean() method is used to optimize query performance by returning plain JavaScript objects (POJOs) instead of full Mongoose documents.
        featuredProducts= await Product.find({isFeatured:true}).lean();
        if(!featuredProducts){
            return res.status(404).json({message:"No featured products found"});

        }

        //store in redis for feature quick access
        await redis.set("featured_products",JSON.stringify(featuredProducts));
        res.json(featuredProducts);




    }catch(error){
      console.log("Error in getFeaturedProducts controller",error.message);
      res.status(500).json({message:"Server error",error:error.message});
    }
}

export const deleteProducts = async(req,res) =>{
    try{
        const product= await Product.findById(req.params.id);
        if(!product){
            return res.status(404).json({message:"Product not found"});

        }
        
        //delte image from cloudinary
        if(product.image){
            const publicId=product.image.split("/").pop().split(".")[0];
            try{
               await cloudinary.uploader.destroy(`products/${publicId}`)
               console.log("deleted image from the cloundinary");
            }catch(error){
              console.log("error in delteing the image from cloudinary",error);

            }
        }

        //delte from the database
        await Product.findByIdAndDelete(req.params.id);
        res.json({message:"product delted successfully"});



    }catch(error){
       console.log("Error in delte controller");
       return res.status(500).json({message:error.message});

    }
}

export const getRecommendedProducts= async(req,res) =>{
   try{
    // * 1. Uses MongoDB's aggregation pipeline with `$sample` to select 3 random products.
    // Uses `$project` to include only required fields: _id, name, description, image, and price
       const product= await Product.aggregate([
        {
            $sample:{size:3}
        },{
            $project:{
             _id:1,
            name:1,
            description:1,
            image:1,
            price:1

            }
       
        }
       ])

       res.json(product);
   }catch(error){
        console.log("Error in getRecommendedProducts controller",error.message);
        return res.status(500).json({message:"Server error",error:error.message});

   } 

}

export const getProductByCategory= async(req,res) =>{
    const {category} = req.params;
    try{
        const products= await Product.find({category});
        res.json({products});
        

    }catch(error){
        console.log("Error in getProductByCategory controller",error.message);
        return res.status(500).json({message:"Internal server error",error:error.message})
    }

}

export const toggleFeaturedProduct = async(req,res) =>{
    const {id}= req.params;
    try{
         const product= await Product.findById(id);
         if(product){
            product.isFeatured = !product.isFeatured;
            const updatedProduct= await product.save();
            //update cache-update in redis
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
         }else{
            res.status(404).json({message:"Prodcut not found"});

         }

    }catch(error){
        console.log("Error in toggleFeature controller",error.message);
        return res.status(500).json({message:"Internal server error",message:error.message});

    }
}

async function updateFeaturedProductsCache(){
    try{
       const featuredProducts=await Product.find({isFeatured:true}).lean();
       await redis.set("featured_products",JSON.stringify(featuredProducts));

    }catch(error){
        console.log("Error inupdate cache funciton");
        

    }
}