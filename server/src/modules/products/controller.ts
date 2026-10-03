import { Request, Response } from "express";
import { ProductService } from "./service.ts";
import { ApiResponse } from "../../app/utils/ApiResponse.ts";
import { asyncHandler } from "../../app/utils/asyncHandler.ts";

export class ProductController {
  static getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductService.getAllProducts(req.query);
    res.status(200).json(new ApiResponse(200, products, "Products fetched successfully"));
  });

  static getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
    const products = await ProductService.getFeaturedProducts();
    res.status(200).json(new ApiResponse(200, products, "Featured products fetched successfully"));
  });

  static getProductById = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.getProductById(req.params.id);
    res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
  });

  static createProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
  });

  static updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, product, "Product updated successfully"));
  });

  static deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const result = await ProductService.deleteProduct(req.params.id);
    res.status(200).json(new ApiResponse(200, result, "Product deleted successfully"));
  });
}
