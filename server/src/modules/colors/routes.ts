import express from "express";
import { ColorController } from "./controller.ts";
import { protect, authorize } from "../../app/middlewares/auth.ts";

const router = express.Router();

router.get("/", ColorController.getAllColors);
router.post("/", protect, authorize("admin"), ColorController.createColor);
router.put("/:id", protect, authorize("admin"), ColorController.updateColor);
router.delete("/:id", protect, authorize("admin"), ColorController.deleteColor);

export default router;
