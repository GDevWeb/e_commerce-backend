import { z } from "zod";

const BrandSchema = z.object({
  id: z.number().int().positive().optional(),
  name: z.string().min(1, "Brand name is required").trim(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createBrandSchema = z.object({
  body: BrandSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }),
});

export const updateBrandSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Brand ID must be a valid number",
      })
      .transform(Number),
  }),
  body: BrandSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  }).partial(),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
