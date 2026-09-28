import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import IndexRoutes from "./modules/index.js";




const app = express()

dotenv.config()

const allowedOrigins = new Set([
    "http://localhost:5173",
    ...(process.env.FRONTEND_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean),
])

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
            return callback(null, true)
        }

        return callback(new Error("Origin is not allowed by CORS"))
    },
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use('/uploads', express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'uploads')))

app.use(IndexRoutes)

app.use("/",async(req,res)=>{
    return res.status(200).json({success:true,message:"Backend running Successfully..",data:null,error:null})
})





export default app;