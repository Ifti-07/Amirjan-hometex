import { Request, Response } from "express";
import { CategoryService } from "./service.ts";
import { ApiResponse } from "../../app/utils/ApiResponse.ts";
import { asyncHandler } from "../../app/utils/asyncHandler.ts";

export class CategoryController {
  static getAllCategories = asyncHandler(async (req: Request, res: Response) => {
    const categories = await CategoryService.getAllCategories();
    res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
  });

  static createCategory = asyncHandler(async (req: Request, res: Response) => {
     
    const category = await CategoryService.createCategory(req.body);
    res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
  });

  static updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const category = await CategoryService.updateCategory(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
  });

  static deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const result = await CategoryService.deleteCategory(req.params.id);
    res.status(200).json(new ApiResponse(200, result, "Category deleted successfully"));
  });
}
