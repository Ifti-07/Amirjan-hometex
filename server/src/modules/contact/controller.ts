import { Request, Response } from "express";
import { ContactService } from "./service.ts";
import { ApiResponse } from "../../app/utils/ApiResponse.ts";
import { asyncHandler } from "../../app/utils/asyncHandler.ts";

export class ContactController {
  static createMessage = asyncHandler(async (req: Request, res: Response) => {
    await ContactService.createMessage(req.body);
    res.status(201).json(new ApiResponse(201, null, "Message sent successfully"));
  });

  static getAllMessages = asyncHandler(async (req: Request, res: Response) => {
    const messages = await ContactService.getAllMessages();
    res.status(200).json(new ApiResponse(200, messages, "Messages fetched successfully"));
  });

  static deleteMessage = asyncHandler(async (req: Request, res: Response) => {
    const result = await ContactService.deleteMessage(req.params.id);
    res.status(200).json(new ApiResponse(200, result, "Message deleted successfully"));
  });
}
