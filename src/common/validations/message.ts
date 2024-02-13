import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  content: z.string().nullish(),
  file: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  conversationId: z.string(),
  userId: z.string(),
});
