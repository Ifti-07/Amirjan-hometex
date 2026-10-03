import mongoose from "mongoose";
import { Order } from "../../models/Order.ts";
import { Product } from "../../models/Product.ts";
import { Ledger } from "../../models/Ledger.ts";
import { ApiError } from "../../app/utils/ApiError.ts";

export class OrderService {
  static async createOrder(data: any, userId: string) {
    const { products, totalPrice, deliveryAddress } = data;
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
      // 1. Validate stock and prepare inventory updates
      for (const item of products) {
        const product = await Product.findById(item.product).populate("variants.color").populate("variants.sizes.size");
        if (!product) throw new ApiError(404, `Product ${item.product} not found`);
console.log("Processing product:", product.name, "Color ID:", item.colorId, "Size ID:", item.sizeId, "Quantity:", item.quantity);
        const variant = product.variants.find(v => v.color.toString() === item.colorId);
        if (!variant) throw new ApiError(404, `Color variant not found for product ${product.name}`);

        const sizeObj = variant.sizes.find(s => s.size.toString() === item.sizeId);
        if (!sizeObj) throw new ApiError(404, `Size variant not found for product ${product.name}`);

        if (sizeObj.qty < item.quantity) {
          throw new ApiError(400, `Insufficient stock for ${product.name} (${item.quantity} requested, ${sizeObj.qty} available)`);
        }

        // Deduct stock
        sizeObj.qty -= item.quantity;
        await product.save();
      }

      // 2. Create the order
      const order = await Order.create([{
        user: userId,
        products,
        totalPrice,
        deliveryAddress,
      }]);

      // 3. Create accounting entry (Ledger)
      await Ledger.create([{
        order: order[0]._id,
        user: userId,
        amount: totalPrice,
        type: "Credit",
        description: `Payment received for order ${order[0]._id}`,
      }]);

      // await session.commitTransaction();
      // session.endSession();

      return order[0];
    } catch (err) {
      console.error("Error creating order:", err);
      // await session.abortTransaction();
      // session.endSession();
      throw err;
    }
  }

  static async getUserOrders(userId: string) {
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
  }

  static async getAllOrders(status?: string) {
    let query = {};
    if (status) query = { status };
    const result = await Order.find(query).populate("user", "name email").sort({ createdAt: -1 });
    console.log("Fetched orders:", result);
    return result;
  }

  static async updateOrderStatus(id: string, status: string) {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) throw new ApiError(404, "Order not found");
    return order;
  }

  static async getOrderById(id: string, userId: string, role: string) {
    const order = await Order.findById(id).populate("products.product");
    if (!order) throw new ApiError(404, "Order not found");

    if (order.user.toString() !== userId.toString() && role !== "admin") {
      throw new ApiError(403, "Not authorized to view this order");
    }

    return order;
  }
}
