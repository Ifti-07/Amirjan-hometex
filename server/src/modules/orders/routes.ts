import express from "express";
import { OrderController } from "./controller.ts";
import { protect, authorize } from "../../app/middlewares/auth.ts";

const router = express.Router();

router.post("/", protect, OrderController.createOrder);
router.get("/my-orders", protect, OrderController.getUserOrders);
router.get("/admin/all", protect, authorize("admin"), OrderController.getAllOrders);
router.put("/:id/status", protect, authorize("admin"), OrderController.updateOrderStatus);
router.get("/:id", protect, OrderController.getOrderById);

export default router;
