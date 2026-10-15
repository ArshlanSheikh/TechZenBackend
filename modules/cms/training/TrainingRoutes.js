import express from "express";
import { Authontication, Authorization } from "../../user/middleware/AuthMiddleware.js";
import controller from "./TrainingController.js";

const adminOnly = [Authontication, Authorization(["admin"])];
const router = express.Router();

router.get("/", controller.listPublic);
router.get("/grouped", controller.getGrouped);
router.get("/admin/all", ...adminOnly, controller.listAdmin);
router.get("/:idOrSlug", controller.getBySlugOrId);
router.post("/", ...adminOnly, controller.create);
router.put("/:id", ...adminOnly, controller.update);
router.delete("/:id", ...adminOnly, controller.remove);

export default router;
