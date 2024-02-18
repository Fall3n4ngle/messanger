import { z } from "zod";

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  file: z.string().nullish(),
  conversationId: z.string(),
  userId: z.string(),
});
