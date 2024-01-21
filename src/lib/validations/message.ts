import { z } from "zod";

export const sendMessageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1),
  file: z.string().optional(),
  conversationId: z.string(),
  updatedAt: z.date(),
  memberId: z.string(),
});

export const deleteMessageSchema = z.object({
  messageId: z.string(),
  conversationId: z.string(),
  previousMessageId: z.string().nullable(),
});

export const markAsSeenSchema = z.object({
  messageId: z.string(),
  conversationId: z.string(),
  memberId: z.string(),
});

export const updateMessageSchema = sendMessageSchema.pick({
  id: true,
  file: true,
  content: true,
  conversationId: true,
});

export type SendMessageFields = z.infer<typeof sendMessageSchema>;
export type DeleteMessageFields = z.infer<typeof deleteMessageSchema>;
export type MarkAsSeenFields = z.infer<typeof markAsSeenSchema>;
export type UpdateMessageFields = z.infer<typeof updateMessageSchema>;
