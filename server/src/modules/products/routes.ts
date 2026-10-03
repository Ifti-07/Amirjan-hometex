import express from "express";
import { ProductController } from "./controller.ts";
import { protect, authorize } from "../../app/middlewares/auth.ts";

const router = express.Router();

router.get("/", ProductController.getAllProducts);
router.get("/featured", ProductController.getFeaturedProducts);
router.get("/:id", ProductController.getProductById);

router.post("/", protect, authorize("admin"), ProductController.createProduct);
router.put("/:id", protect, authorize("admin"), ProductController.updateProduct);
router.delete("/:id", protect, authorize("admin"), ProductController.deleteProduct);

export default router;
