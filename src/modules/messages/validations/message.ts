import { z } from "zod";

export const deleteMessageSchema = z.object({
  messageId: z.string(),
  conversationId: z.string(),
});

export const markAsSeenSchema = z.object({
  messageId: z.string(),
  conversationId: z.string(),
  userId: z.string(),
});

export type DeleteMessageFields = z.infer<typeof deleteMessageSchema>;
export type MarkAsSeenFields = z.infer<typeof markAsSeenSchema>;
