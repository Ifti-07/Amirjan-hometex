import { Message } from "../../models/Message.ts";
import { ApiError } from "../../app/utils/ApiError.ts";

export class ContactService {
  static async createMessage(data: any) {
    return await Message.create(data);
  }

  static async getAllMessages() {
    return await Message.find().sort({ createdAt: -1 });
  }

  static async deleteMessage(id: string) {
    const message = await Message.findByIdAndDelete(id);
    if (!message) throw new ApiError(404, "Message not found");
    return { message: "Message removed" };
  }
}
