import { Color } from "../../models/Color.ts";
import { ApiError } from "../../app/utils/ApiError.ts";

export class ColorService {
  static async getAllColors() {
    return await Color.find().sort({ name: 1 });
  }

  static async createColor(data: any) {
    return await Color.create(data);
  }

  static async updateColor(id: string, data: any) {
    const color = await Color.findByIdAndUpdate(id, data, { new: true });
    if (!color) throw new ApiError(404, "Color not found");
    return color;
  }

  static async deleteColor(id: string) {
    const color = await Color.findByIdAndDelete(id);
    if (!color) throw new ApiError(404, "Color not found");
    return { message: "Color removed" };
  }
}
