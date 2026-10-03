import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './server/src/models/User.ts';
import { Category } from './server/src/models/Category.ts';
import { Product } from './server/src/models/Product.ts';
import { Offer } from './server/src/models/Offer.ts';

dotenv.config();

const categories = [
  { name: 'Shirts', slug: 'shirts' },
  { name: 'Pants', slug: 'pants' },
  { name: 'T-Shirts', slug: 't-shirts' },
  { name: 'Accessories', slug: 'accessories' },
];

const products = [
  {
    name: 'Premium Cotton Formal Shirt',
    price: 45.99,
    description: 'High-quality 100% cotton formal shirt, perfect for office and formal occasions. Breathable and easy to iron.',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800'],
    categoryName: 'Shirts',
    stock: 50,
    featured: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White', 'Blue', 'Pink'],
  },
  {
    name: 'Slim Fit Denim Jeans',
    price: 59.00,
    description: 'Classic slim fit denim jeans with a comfortable stretch. Durable and stylish for everyday wear.',
    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'],
    categoryName: 'Pants',
    stock: 30,
    featured: true,
    sizes: ['30', '32', '34', '36'],
    colors: ['Blue', 'Black'],
  },
  {
    name: 'Graphic Print T-Shirt',
    price: 25.00,
    description: 'Cool graphic print t-shirt made from soft organic cotton. A must-have for your casual wardrobe.',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'],
    categoryName: 'T-Shirts',
    stock: 100,
    featured: true,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'White', 'Grey'],
  },
  {
    name: 'Chino Trousers',
    price: 49.00,
    description: 'Versatile chino trousers that can be dressed up or down. Made from a soft cotton-twill blend.',
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&q=80&w=800'],
    categoryName: 'Pants',
    stock: 40,
    featured: false,
    sizes: ['30', '32', '34', '36'],
    colors: ['Beige', 'Navy', 'Olive'],
  },
  {
    name: 'Casual Linen Shirt',
    price: 39.00,
    description: 'Lightweight and breathable linen shirt, ideal for summer days. Relaxed fit for maximum comfort.',
    images: ['https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?auto=format&fit=crop&q=80&w=800'],
    categoryName: 'Shirts',
    stock: 25,
    featured: true,
    sizes: ['M', 'L', 'XL'],
    colors: ['Light Blue', 'White'],
  },
  {
    name: 'Leather Belt',
    price: 29.00,
    description: 'Genuine leather belt with a classic buckle. Adds a touch of sophistication to any outfit.',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'],
    categoryName: 'Accessories',
    stock: 60,
    featured: false,
  }
];

const offers = [
  {
    title: 'Summer Sale',
    description: 'Get up to 50% off on all summer collections.',
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200',
    link: '/shop?category=shirts',
    active: true,
  },
  {
    title: 'New Arrivals',
    description: 'Check out our latest arrivals for the season.',
    discount: 'NEW',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=1200',
    link: '/shop',
    active: true,
  }
];

async function seed() {
  try {
    const MONGODB_URI = process.env.DB_URL || "mongodb+srv://abduljabbardev_db_user:abduljabbardev_db_user@ifticlaster.apmkuui.mongodb.net/homtexDB?retryWrites=true&w=majority";
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Offer.deleteMany({});

    // Create Admin
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'adminpassword'; // Will be hashed by pre-save hook
    await User.create({
      name: "Cash'N Style Admin",
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });
    console.log('Admin user created');

    // Create Categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories seeded');

    // Create Products
    const productsToInsert = products.map(p => {
      const category = createdCategories.find(c => c.name === p.categoryName);
      return { ...p, category: category?._id };
    });
    await Product.insertMany(productsToInsert);
    console.log('Products seeded');

    // Create Offers
    await Offer.insertMany(offers);
    console.log('Offers seeded');

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
