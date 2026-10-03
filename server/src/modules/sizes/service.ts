import { Size } from "../../models/Size.ts";
import { ApiError } from "../../app/utils/ApiError.ts";

export class SizeService {
  static async getAllSizes() {
    return await Size.find().sort({ name: 1 });
  }

  static async createSize(data: any) {
    return await Size.create(data);
  }

  static async updateSize(id: string, data: any) {
    const size = await Size.findByIdAndUpdate(id, data, { new: true });
    if (!size) throw new ApiError(404, "Size not found");
    return size;
  }

  static async deleteSize(id: string) {
    const size = await Size.findByIdAndDelete(id);
    if (!size) throw new ApiError(404, "Size not found");
    return { message: "Size removed" };
  }
}
