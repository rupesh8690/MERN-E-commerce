import express from "express"
import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"


import dotenv from "dotenv"
dotenv.config()

import cookieParser from "cookie-parser"


import {connectDB} from "./lib/db.js"

const app=express()
const PORT=process.env.PORT

app.use(express.json()); //The line app.use(express.json()) is used in Express.js to parse incoming JSON request bodies and make the data available in req.body.
app.use(cookieParser())

app.use("/api/auth",authRoutes);
app.use("/api/product",productRoutes);


app.listen(PORT,()=>{
    console.log("server is running on http://localhost:"+PORT)
    //call connectDB
    connectDB();
})