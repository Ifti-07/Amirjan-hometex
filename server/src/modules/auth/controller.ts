import { Request, Response } from "express";
import { AuthService } from "./service.ts";
import { ApiResponse } from "../../app/utils/ApiResponse.ts";
import { asyncHandler } from "../../app/utils/asyncHandler.ts";
import { AuthRequest } from "../../app/middlewares/auth.ts";

export class AuthController {
  static register = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.register(req.body);
    res.status(201).json(new ApiResponse(201, result, "User registered successfully"));
  });

  static login = asyncHandler(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    res.status(200).json(new ApiResponse(200, result, "User logged in successfully"));
  });

  static getMyProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
   
    const result = await AuthService.getMyProfile(req.user._id); 
    res.status(200).json(new ApiResponse(200, result, "User profile fetched successfully"));
  });
  static getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    const user = await AuthService.getCurrentUser(req.user._id);
    res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
  });
}
