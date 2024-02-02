import { messageSchema } from "prisma/zod";
import { z } from "zod";

export const sendMessageSchema = messageSchema.pick({
  content: true,
  file: true,
  conversationId: true,
  userId: true,
});

export const editMessageSchema = messageSchema.pick({
  id: true,
  file: true,
  content: true,
  conversationId: true,
});

export type SendMessageFields = z.infer<typeof sendMessageSchema>;
export type EditMessageFields = z.infer<typeof editMessageSchema>;
