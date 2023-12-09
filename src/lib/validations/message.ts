import { z } from "zod";

export const messageSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1),
  file: z.string().optional(),
  conversationId: z.string(),
});

export type MessageFields = z.infer<typeof messageSchema>;
