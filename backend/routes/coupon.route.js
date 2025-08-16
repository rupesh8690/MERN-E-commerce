import express, { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validateCoupon } from "../controllers/coupon.controller.js";
import { getCoupon } from "../controllers/coupon.controller.js";
const router= express.Router();

router.get("/",protectRoute,getCoupon);
router.get("/validateCoupon",protectRoute,validateCoupon);

export default router;
