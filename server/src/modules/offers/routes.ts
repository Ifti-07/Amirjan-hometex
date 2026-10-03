import express from "express";
import { OfferController } from "./controller.ts";
import { protect, authorize } from "../../app/middlewares/auth.ts";

const router = express.Router();

router.get("/", OfferController.getActiveOffers);
router.get("/admin", protect, authorize("admin"), OfferController.getAllOffers);
router.post("/", protect, authorize("admin"), OfferController.createOffer);
router.put("/:id", protect, authorize("admin"), OfferController.updateOffer);
router.delete("/:id", protect, authorize("admin"), OfferController.deleteOffer);

export default router;
