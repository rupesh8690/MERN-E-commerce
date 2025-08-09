import express from "express";
const router=express.Router();
import { getAllProducts,getFeaturedProducts,createProducts,deleteProducts,getRecommendedProducts,getProductByCategory,toggleFeaturedProduct} from "../controllers/product.controller.js";
import { protectRoute,adminRoute } from "../middleware/auth.middleware.js";

router.get("/",protectRoute,adminRoute,getAllProducts)
router.get("/featured",getFeaturedProducts);
router.get("/recommendations",getRecommendedProducts);
router.get("/category/:category",getProductByCategory);

//only admin can create products
router.post("/",protectRoute,adminRoute,createProducts);

router.patch("/:id",protectRoute,adminRoute,toggleFeaturedProduct);

router.delete("/:id",protectRoute,adminRoute,deleteProducts);

export default router;
