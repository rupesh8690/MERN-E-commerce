import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized-No access token provided" });
    }
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // when we get the user put it to request
      next(); //call the next funciton
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized-Access token expired" });
      }
      throw error; // so that we can catch it in the catch block
    }
  } catch (error) {
    console.log("Error in protectRoute controller", error.message);
    return res
      .status(401)
      .json({ message: "Unauthorized Invalid access token provided" });
  }
};

export const adminRoute = async(req,res) =>{
  //if req.user exist and req.user.role== admim then it is coming from protect route where we set user in req.
  
  if(req.user && req.user.role === "admin"){
    next();
  }else{
    return res.status(403).json({message:"Access denied-Admin only"});

  }
}