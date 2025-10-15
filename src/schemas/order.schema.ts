import z from "zod";

const OrderSchema = z.object({
  id: z.number().int().positive().optional(),
  customer_id: z.number().int().positive(),
  order_date: z.date().optional(),
  total: z.number().positive(),
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const createOrderSchema = z.object({
  body: OrderSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    order_date: true,
  }).strict(),
});

export const updateOrderSchema = z.object({
  params: z.object({
    id: z
      .string()
      .refine((val) => !isNaN(Number(val)), {
        message: "Order ID must be a valid number",
      })
      .transform(Number),
  }),
  body: OrderSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    customer_id: true,
    order_date: true,
  })
    .partial()
    .strict(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
