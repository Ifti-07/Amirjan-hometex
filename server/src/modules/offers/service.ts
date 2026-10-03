import { Offer } from "../../models/Offer.ts";
import { ApiError } from "../../app/utils/ApiError.ts";

export class OfferService {
  static async getActiveOffers() {
    return await Offer.find({ active: true }).sort({ createdAt: -1 });
  }

  static async getAllOffers() {
    return await Offer.find().sort({ createdAt: -1 });
  }

  static async createOffer(data: any) {
    return await Offer.create(data);
  }

  static async updateOffer(id: string, data: any) {
    const offer = await Offer.findByIdAndUpdate(id, data, { new: true });
    if (!offer) throw new ApiError(404, "Offer not found");
    return offer;
  }

  static async deleteOffer(id: string) {
    const offer = await Offer.findByIdAndDelete(id);
    if (!offer) throw new ApiError(404, "Offer not found");
    return { message: "Offer deleted" };
  }
}
