import axios from "axios";
import z from "zod";
import {
  type Product,
  type ProductsApiResponse,
  type CartsApiResponse,
  ProductsApiResponseSchema,
  ProductSchema,
  CartsApiResponseSchema,
  CategorySchema,
  type Category,
  type AddProductData,
} from "./types";

const API_BASE_URL = "https://dummyjson.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Fetch all products (no pagination)
export async function fetchAllProducts(): Promise<ProductsApiResponse> {
  const { data } = await api.get("/products", { params: { limit: 0 } });
  return ProductsApiResponseSchema.parse(data);
}

// Fetch a paginated and searchable list of products
export async function fetchProducts({
  pageParam = 0,
  queryKey,
}: {
  pageParam?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryKey: any[];
}): Promise<ProductsApiResponse> {
  const [, { searchTerm, category }] = queryKey;
  const limit = 10;
  const skip = pageParam * limit;

  let url = "/products";
  let params: Record<string, string | number> = { limit, skip };

  if (searchTerm) {
    url = "/products/search";
    params = { q: searchTerm, limit, skip };
  } else if (category && category !== "all") {
    url = `/products/category/${category}`;
    params = { limit, skip };
  }

  const { data } = await api.get(url, { params });
  return ProductsApiResponseSchema.parse(data);
}

// Add a new product
export async function addProduct(
  newProductData: AddProductData
): Promise<Product> {
  const { data: responseData } = await api.post(
    "/products/add",
    newProductData
  );

  const completeProduct: Product = {
    ...newProductData,
    id: responseData.id,
    rating: 0,
    discountPercentage: 0,
    images: [],
    thumbnail: "https://i.dummyjson.com/v1/images/preview/infant-1.jpg", // placeholder
    reviews: [],
    dimensions: { width: 0, height: 0, depth: 0 },
  };

  return ProductSchema.parse(completeProduct);
}

// Delete a product
export async function deleteProduct(
  productId: number
): Promise<{ id: number }> {
  await api.delete(`/products/${productId}`);
  return { id: productId };
}

// Fetch orders (carts)
export async function fetchOrders(): Promise<CartsApiResponse> {
  const { data } = await api.get("/carts");
  return CartsApiResponseSchema.parse(data);
}

// Fetch product categories
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get("/products/categories");
  return z.array(CategorySchema).parse(data);
}

// Update an existing product
export async function updateProduct(updatedProduct: Product): Promise<Product> {
  const { id, ...data } = updatedProduct;
  const { data: responseData } = await api.put(`/products/${id}`, data);
  return ProductSchema.parse(responseData);
}
