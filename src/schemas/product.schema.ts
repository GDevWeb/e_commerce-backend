import * as z from "zod";

const Product = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, "Product name cannot be empty"),
  sku: z.string().min(1, "SKU cannot be empty"),
  imageUrl: z.url("Invalid image URL").optional(),
  description: z.string().optional(),
  weight: z.number().positive("Weight must be a positive number").optional(),
  price: z.number().positive("Price must be a positive number"),
  stock_quantity: z
    .number()
    .int()
    .nonnegative("Stock quantity cannot be negative"),
  category_id: z
    .number()
    .int()
    .positive("Category ID must be a positive number"),
  brand_id: z.number().int().positive("Brand ID must be a positive number"),
  created_at: z.iso.datetime().optional(),
  updated_at: z.iso.datetime().optional(),
});

export const createProductSchema = z.object({
  body: Product.omit({
    id: true,
    created_at: true,
    updated_at: true,
    sku: true,
  }).extend({
    category_id: z
      .number()
      .int()
      .positive("Category ID must be a positive number"),
    brand_id: z.number().int().positive("Brand ID must be a positive number"),
  }),
});

export const updateProductSchema = z.object({
  body: Product.omit({
    id: true,
    created_at: true,
    updated_at: true,
    sku: true,
  })
    .partial()
    .extend({
      category_id: z
        .number()
        .int()
        .positive("Category ID must be a positive number")
        .optional(),
      brand_id: z
        .number()
        .int()
        .positive("Brand ID must be a positive number")
        .optional(),
    }),
});

export const productParamsSchema = z.object({
  productId: z
    .string()
    .refine((val) => !isNaN(Number(val)), {
      message: "Product ID must be a number",
    })
    .transform(Number),
});
