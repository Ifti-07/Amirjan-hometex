import express from "express";
import { SizeController } from "./controller.ts";
import { protect, authorize } from "../../app/middlewares/auth.ts";

const router = express.Router();

router.get("/", SizeController.getAllSizes);
router.post("/", protect, authorize("admin"), SizeController.createSize);
router.put("/:id", protect, authorize("admin"), SizeController.updateSize);
router.delete("/:id", protect, authorize("admin"), SizeController.deleteSize);

export default router;
