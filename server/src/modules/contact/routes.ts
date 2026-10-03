import express from "express";
import { ContactController } from "./controller.ts";
import { protect, authorize } from "../../app/middlewares/auth.ts";

const router = express.Router();

router.post("/", ContactController.createMessage);
router.get("/", protect, authorize("admin"), ContactController.getAllMessages);
router.delete("/:id", protect, authorize("admin"), ContactController.deleteMessage);

export default router;
