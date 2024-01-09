import { z } from "zod";

export const sendMessageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1),
  file: z.string().optional(),
  conversationId: z.string(),
  updatedAt: z.date(),
  memberId: z.string(),
});

export type MessageFields = z.infer<typeof sendMessageSchema>;
