import { z } from "zod";

const memberSchema = z.object({
  id: z.string(),
});

export const conversationSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, {
      message: "Name must be at least 2 characters",
    }),
  image: z.string().optional().nullable(),
  members: memberSchema.array().optional(),
  isGroup: z.boolean().default(false).optional(),
});

export type ConversationFields = z.infer<typeof conversationSchema>;
