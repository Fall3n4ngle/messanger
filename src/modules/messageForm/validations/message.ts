import { z } from "zod";

export const sendMessageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1),
  file: z.string().optional(),
  conversationId: z.string(),
  updatedAt: z.date(),
  userId: z.string(),
});

export const editMessageSchema = sendMessageSchema.pick({
  id: true,
  file: true,
  content: true,
  conversationId: true,
});

export type SendMessageFields = z.infer<typeof sendMessageSchema>;
export type EditMessageFields = z.infer<typeof editMessageSchema>;
