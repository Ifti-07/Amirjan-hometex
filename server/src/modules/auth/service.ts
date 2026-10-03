import jwt from "jsonwebtoken";
import { User } from "../../models/User.ts";
import { ApiError } from "../../app/utils/ApiError.ts";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export class AuthService {
  static async register(data: any) {
    const { name, email, password } = data;
    const userExists = await User.findOne({ email });
    if (userExists) throw new ApiError(400, "User already exists");

    const user = await User.create({ name, email, password });
    const token = this.generateToken(user._id);

    return {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }

  static async login(data: any) {
    const { email, password } = data;
    const user: any = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, "Invalid email or password");
    }

    const token = this.generateToken(user._id);
    return {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }
  static async getMyProfile(id: string) {
    const user: any = await User.findById(id).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }
 
    return {
      user: { id: user._id, name: user.name, email: user.email, address: user.address },
    };
  }

  static async getCurrentUser(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  private static generateToken(id: any) {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "30d" });
  }
}
