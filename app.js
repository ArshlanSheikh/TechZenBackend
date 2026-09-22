import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import IndexRoutes from "./modules/index.js";



const app = express()

dotenv.config()

app.use(cors({
    origin:["http://localhost:5000/"],
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(IndexRoutes)

app.use("/",async(req,res)=>{
    return res.status(200).json({success:true,message:"Backend running Successfully..",data:null,error:null})
})





export default app;