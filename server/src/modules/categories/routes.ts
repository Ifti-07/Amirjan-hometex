import express from "express";
import { CategoryController } from "./controller.ts";
import { protect, authorize } from "../../app/middlewares/auth.ts";

const router = express.Router();

router.get("/", CategoryController.getAllCategories);
router.post("/", protect, authorize("admin"), CategoryController.createCategory);
router.put("/:id", protect, authorize("admin"), CategoryController.updateCategory);
router.delete("/:id", protect, authorize("admin"), CategoryController.deleteCategory);

export default router;
