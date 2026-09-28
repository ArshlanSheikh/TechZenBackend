import express from "express";
import { Authontication, Authorization } from "../../user/middleware/AuthMiddleware.js";

const adminOnly = [Authontication, Authorization(["admin"] )];

export const createContentRoutes = (controller) => {
  const router = express.Router();

  router.get("/", controller.listPublic);
  router.get("/admin/all", ...adminOnly, controller.listAdmin);
  router.get("/:id", controller.getPublic);
  router.post("/", ...adminOnly, controller.create);
  router.put("/:id", ...adminOnly, controller.update);
  router.delete("/:id", ...adminOnly, controller.remove);

  return router;
};