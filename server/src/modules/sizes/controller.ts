import { Request, Response } from "express";
import { SizeService } from "./service.ts";
import { ApiResponse } from "../../app/utils/ApiResponse.ts";
import { asyncHandler } from "../../app/utils/asyncHandler.ts";

export class SizeController {
  static getAllSizes = asyncHandler(async (req: Request, res: Response) => {
    const sizes = await SizeService.getAllSizes();
    res.status(200).json(new ApiResponse(200, sizes, "Sizes fetched successfully"));
  });

  static createSize = asyncHandler(async (req: Request, res: Response) => {
    const size = await SizeService.createSize(req.body);
    res.status(201).json(new ApiResponse(201, size, "Size created successfully"));
  });

  static updateSize = asyncHandler(async (req: Request, res: Response) => {
    const size = await SizeService.updateSize(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, size, "Size updated successfully"));
  });

  static deleteSize = asyncHandler(async (req: Request, res: Response) => {
    const result = await SizeService.deleteSize(req.params.id);
    res.status(200).json(new ApiResponse(200, result, "Size deleted successfully"));
  });
}
