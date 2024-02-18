import { z } from "zod";

export const upsertUserSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, { message: "Name must be at least 2 characters long" }),
  image: z.string().nullable(),
});

export type UpsertUserFields = z.infer<typeof upsertUserSchema>;
