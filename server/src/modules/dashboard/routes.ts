import express from "express";
import { DashboardController } from "./controller.ts";
import { protect, authorize } from "../../app/middlewares/auth.ts";

const router = express.Router();

router.get("/stats", protect, authorize("admin"), DashboardController.getStats);

export default router;
