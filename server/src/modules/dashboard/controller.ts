import { Request, Response } from "express";
import { DashboardService } from "./service.ts";
import { ApiResponse } from "../../app/utils/ApiResponse.ts";
import { asyncHandler } from "../../app/utils/asyncHandler.ts";

export class DashboardController {
  static getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await DashboardService.getStats();
    res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
  });
}
