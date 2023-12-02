import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, { message: "Name must be at least 2 characters long" }),
  image: z.string().nullable(),
  clerkId: z.string(),
});

export type UserFields = z.infer<typeof userSchema>;
