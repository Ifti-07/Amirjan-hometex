import { Request, Response } from "express";
import { OrderService } from "./service.ts";
import { ApiResponse } from "../../app/utils/ApiResponse.ts";
import { asyncHandler } from "../../app/utils/asyncHandler.ts";
import { AuthRequest } from "../../app/middlewares/auth.ts";

export class OrderController {
  static createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await OrderService.createOrder(req.body, req.user._id);
    res.status(201).json(new ApiResponse(201, order, "Order created successfully"));
  });

  static getUserOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
    const orders = await OrderService.getUserOrders(req.user._id);
    res.status(200).json(new ApiResponse(200, orders, "User orders fetched successfully"));
  });

  static getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await OrderService.getAllOrders(req.query.status as string);
    res.status(200).json(new ApiResponse(200, orders, "All orders fetched successfully"));
  });

  static updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const order = await OrderService.updateOrderStatus(req.params.id, req.body.status);
    res.status(200).json(new ApiResponse(200, order, "Order status updated successfully"));
  });

  static getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
    const order = await OrderService.getOrderById(req.params.id, req.user._id, req.user.role);
    res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
  });
}
