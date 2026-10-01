import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import IndexRoutes from "./modules/index.js";
import ConnectDB from "./dbConfig.js";




const app = express()

dotenv.config()

// const allowedOrigins = new Set([
//     "http://localhost:5173",
//     ...(process.env.FRONTEND_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean),
// ])

// app.use(cors({
//     origin(origin, callback) {
//         if (!origin || allowedOrigins.has(origin)) {
//             return callback(null, true)
//         }

//         return callback(new Error("Origin is not allowed by CORS"))
//     },
//     credentials:true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// }))

app.use(cors({
    origin(origin, callback) {
        // Allow non-browser clients (curl, Postman) — no CORS header needed
        if (!origin) return callback(null, true)

        // Build the allowed list fresh — always sees the latest env vars
        const allowedOrigins = new Set([
            "http://localhost:5173",
            ...(process.env.FRONTEND_ORIGINS || "")
                .split(",")
                .map((o) => o.trim().replace(/\/$/, ""))
                .filter(Boolean),
        ])

        console.log("[CORS] origin:", origin, "| allowed:", [...allowedOrigins])

        if (allowedOrigins.has(origin)) {
            return callback(null, origin)   // ⭐ return the exact origin string
        }

        console.log("[CORS] ❌ Blocked:", origin)
        return callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use('/uploads', express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'uploads')))


// ⭐ DB connect BEFORE every route
app.use(async (req, res, next) => {
  try {
    await ConnectDB();
    next();
  } catch (err) {
    res.status(500).json({ success: false, message: "DB connection failed", error: err.message });
  }
});


app.use(IndexRoutes)


app.use("/",async(req,res)=>{
    console.log('/ request hit Backend running Successfully..')
    return res.status(200).json({success:true,message:"Backend running Successfully..",data:null,error:null})
})

app.use("/health",async(req,res)=>{
    console.log('/health request hit Get Health Successfully..')
    return res.status(200).json({success:true,message:"Get Health Successfully..",data:null,error:null})
})




export default app;