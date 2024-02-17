import { z } from "zod";

const messageSchema = z.object({
  id: z.string(),
  content: z.string().nullish(),
  file: z.string().nullish(),
  conversationId: z.string(),
  userId: z.string(),
});

export const sendMessageSchema = messageSchema
  .pick({
    file: true,
    conversationId: true,
    userId: true,
  })
  .merge(
    z.object({
      content: z.string().min(1),
    }),
  );

export const editMessageSchema = messageSchema.pick({
  id: true,
  file: true,
  content: true,
  conversationId: true,
});

export type SendMessageFields = z.infer<typeof sendMessageSchema>;
export type EditMessageFields = z.infer<typeof editMessageSchema>;
