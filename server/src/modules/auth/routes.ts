import express from "express";
import { AuthController } from "./controller.ts";
import { protect } from "../../app/middlewares/auth.ts";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/me", protect, AuthController.getCurrentUser);
router.get("/profile", protect, AuthController.getMyProfile);
export default router;
