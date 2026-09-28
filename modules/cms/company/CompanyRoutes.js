import express from "express";
import { Authontication, Authorization } from "../../user/middleware/AuthMiddleware.js";
import { getCompany, updateCompany } from "./CompanyController.js";

const router = express.Router();
router.get("/", getCompany);
router.put("/", Authontication, Authorization(["admin"]), updateCompany);

export default router;