import { z } from "zod";

const DimensionsSchema = z.object({
  width: z.number(),
  height: z.number(),
  depth: z.number(),
});

const ReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string(),
  date: z.string().datetime(),
  reviewerName: z.string(),
  reviewerEmail: z.email(),
});

export const ProductSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." }),
  description: z.string(),
  price: z.number().positive({ message: "Price must be a positive number." }),
  discountPercentage: z.number(),
  rating: z.number(),
  stock: z.number().int().nonnegative({ message: "Stock cannot be negative." }),
  brand: z.string().optional(),
  category: z.string(),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()),
  reviews: z.array(ReviewSchema),
  dimensions: DimensionsSchema,
});

export const ProductsApiResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

const CartProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  total: z.number(),
  discountPercentage: z.number(),
  discountedTotal: z.number(),
  thumbnail: z.string().url(),
});

export const CartSchema = z.object({
  id: z.number(),
  products: z.array(CartProductSchema),
  total: z.number(),
  discountedTotal: z.number(),
  userId: z.number(),
  totalProducts: z.number(),
  totalQuantity: z.number(),
});

export const CartsApiResponseSchema = z.object({
  carts: z.array(CartSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const CategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.string().url(),
});

export const AddProductSchema = ProductSchema.pick({
  title: true,
  brand: true,
  price: true,
  stock: true,
  category: true,
  description: true,
});

// Infer the TypeScript types
export type Product = z.infer<typeof ProductSchema>;
export type ProductsApiResponse = z.infer<typeof ProductsApiResponseSchema>;

export type Cart = z.infer<typeof CartSchema>;
export type CartsApiResponse = z.infer<typeof CartsApiResponseSchema>;

export type Category = z.infer<typeof CategorySchema>;
export type AddProductData = z.infer<typeof AddProductSchema>;