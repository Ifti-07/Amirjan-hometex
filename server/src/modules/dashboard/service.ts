import { Order } from "../../models/Order.ts";
import { Product } from "../../models/Product.ts";
import { User } from "../../models/User.ts";

export class DashboardService {
  static async getStats() {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });

    const orders = await Order.find({ status: "Delivered" });
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0);

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, status: "Delivered" } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalProducts,
      totalUsers,
      totalRevenue,
      monthlyStats,
    };
  }
}
