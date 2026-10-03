import { Category } from "../../models/Category.ts";
import { ApiError } from "../../app/utils/ApiError.ts";

export class CategoryService {

  private static generateSlug(name: string) {
    return name.trim().replace(/\s+/g, '-').toLowerCase();
  }

  static async getAllCategories() {
    return await Category.find().sort({ name: 1 });
  }

  static async createCategory(data: any) {

    if (!data?.name || typeof data.name !== 'string' || !data.name.trim()) {
      throw new ApiError(400, 'Category name is required');
    }

    const slug = this.generateSlug(data.name);

    const existingCategory = await Category.findOne({ slug: data.name.trim().toLowerCase() });
    if (existingCategory) {
      throw new ApiError(400, 'Category with this name already exists');
    }

    return await Category.create({
      name: data.name.trim(),
      slug,
      description: data?.description,
      image: data?.image,
    });
  }

  static async updateCategory(id: string, data: any) {
    const updateData: any = { ...data };

    // Never trust a client-provided slug; generate from name when changing category name.
    if ('slug' in updateData) {
      delete updateData.slug;
    }

    if (data?.name && typeof data.name === 'string') {
      updateData.name = data.name.trim();
      updateData.slug = this.generateSlug(data.name);

      const existingCategory = await Category.findOne({ slug: updateData.slug, _id: { $ne: id } });
      if (existingCategory) {
        throw new ApiError(400, 'Category with this name already exists');
      }
    }

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!category) throw new ApiError(404, 'Category not found');
    return category;
  }

  static async deleteCategory(id: string) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new ApiError(404, "Category not found");
    return { message: "Category removed" };
  }
}
