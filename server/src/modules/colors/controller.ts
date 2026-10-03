import { Request, Response } from "express";
import { ColorService } from "./service.ts";
import { ApiResponse } from "../../app/utils/ApiResponse.ts";
import { asyncHandler } from "../../app/utils/asyncHandler.ts";

export class ColorController {
  static getAllColors = asyncHandler(async (req: Request, res: Response) => {
    const colors = await ColorService.getAllColors();
    res.status(200).json(new ApiResponse(200, colors, "Colors fetched successfully"));
  });

  static createColor = asyncHandler(async (req: Request, res: Response) => {
    const color = await ColorService.createColor(req.body);
    res.status(201).json(new ApiResponse(201, color, "Color created successfully"));
  });

  static updateColor = asyncHandler(async (req: Request, res: Response) => {
    const color = await ColorService.updateColor(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, color, "Color updated successfully"));
  });

  static deleteColor = asyncHandler(async (req: Request, res: Response) => {
    const result = await ColorService.deleteColor(req.params.id);
    res.status(200).json(new ApiResponse(200, result, "Color deleted successfully"));
  });
}
