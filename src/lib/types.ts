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
  reviewerEmail: z.string().email(),
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
  brand: z.string(),
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

export type Product = z.infer<typeof ProductSchema>;
export type ProductsApiResponse = z.infer<typeof ProductsApiResponseSchema>;
