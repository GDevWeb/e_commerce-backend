import { z } from "zod";
import { CategoryType } from "../generated/prisma";

const categoryTypeSchema = z.enum(CategoryType);

const CategorySchema = z.object({
  id: z.number().int().positive().optional(),
  name: categoryTypeSchema,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createCategorySchema = z.object({
  body: CategorySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Category ID must be a valid number",
      })
      .transform(Number),
  }),
  body: CategorySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
