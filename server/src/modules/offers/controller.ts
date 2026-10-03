import { Request, Response } from "express";
import { OfferService } from "./service.ts";
import { ApiResponse } from "../../app/utils/ApiResponse.ts";
import { asyncHandler } from "../../app/utils/asyncHandler.ts";

export class OfferController {
  static getActiveOffers = asyncHandler(async (req: Request, res: Response) => {
    const offers = await OfferService.getActiveOffers();
    res.status(200).json(new ApiResponse(200, offers, "Active offers fetched successfully"));
  });

  static getAllOffers = asyncHandler(async (req: Request, res: Response) => {
    const offers = await OfferService.getAllOffers();
    res.status(200).json(new ApiResponse(200, offers, "All offers fetched successfully"));
  });

  static createOffer = asyncHandler(async (req: Request, res: Response) => {
    const offer = await OfferService.createOffer(req.body);
    res.status(201).json(new ApiResponse(201, offer, "Offer created successfully"));
  });

  static updateOffer = asyncHandler(async (req: Request, res: Response) => {
    const offer = await OfferService.updateOffer(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, offer, "Offer updated successfully"));
  });

  static deleteOffer = asyncHandler(async (req: Request, res: Response) => {
    const result = await OfferService.deleteOffer(req.params.id);
    res.status(200).json(new ApiResponse(200, result, "Offer deleted successfully"));
  });
}
