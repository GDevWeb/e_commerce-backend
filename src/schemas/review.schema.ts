import z from "zod";

const reviewSchema = z.object({
  id: z.number().int().positive().optional(),
  product_id: z.number().int().positive(),
  customer_id: z.number().int().positive(),
  rating: z.number().positive().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().max(500).optional().nullable(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createReviewSchema = z.object({
  body: reviewSchema
    .omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    })
    .strict(),
});

export const updateReviewSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Review ID must be a valid number",
      })
      .transform(Number),
  }),
  body: reviewSchema
    .omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      customer_id: true,
      product_id: true,
    })
    .partial()
    .strict(),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
