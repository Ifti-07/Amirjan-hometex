import { Product } from "../../models/Product.ts";
import { ApiError } from "../../app/utils/ApiError.ts";

export class ProductService {
  static async getAllProducts(query: any) {
    const { category, sort, search, minPrice, maxPrice } = query;
    let filter: any = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let productsQuery = Product.find(filter)
      .populate("category")
      .populate("variants.color")
      .populate("variants.sizes.size");

    if (sort === "price-asc") productsQuery = productsQuery.sort({ price: 1 });
    else if (sort === "price-desc") productsQuery = productsQuery.sort({ price: -1 });
    else productsQuery = productsQuery.sort({ createdAt: -1 });

    return await productsQuery;
  }

  static async getFeaturedProducts() {
    return await Product.find({ featured: true })
      .populate("category")
      .populate("variants.color")
      .populate("variants.sizes.size")
      .limit(8);
  }

  static async getProductById(id: string) {
    const product = await Product.findById(id)
      .populate("category")
      .populate("variants.color")
      .populate("variants.sizes.size");
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  }

  static async createProduct(data: any) {
    return await Product.create(data);
  }

  static async updateProduct(id: string, data: any) {
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!product) throw new ApiError(404, "Product not found");
    return product;
  }

  static async deleteProduct(id: string) {
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new ApiError(404, "Product not found");
    return { message: "Product removed" };
  }
}
