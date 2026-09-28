import express from "express";
import { Authontication, Authorization } from "../../user/middleware/AuthMiddleware.js";
import { getOverview } from "./OverviewController.js";

const router = express.Router();
router.get("/", Authontication, Authorization(["admin"]), getOverview);

export default router;