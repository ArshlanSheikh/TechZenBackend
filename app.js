import express from "express";

const app = express()


app.use("/",(req,res)=>{
    return res.status(200).json({success:true,message:"Backend running Successfully..",data:null,error:null})
})

export default app;