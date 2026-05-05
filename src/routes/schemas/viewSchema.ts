import { z } from "zod";

export const viewSchema = z.object({
  params: z.object({
    id: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => Number.isInteger(val) && val >= 0, {
        message: "Invalid blog ID. Must be a non-negative integer.",
      }),
  }),
});
