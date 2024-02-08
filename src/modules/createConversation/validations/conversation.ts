import { conversationSchema } from "@/common/validations";
import { z } from "zod";

export const createConversationSchema = conversationSchema.pick({
  name: true,
  image: true,
  members: true,
});

export type CreateConversationFields = z.infer<typeof createConversationSchema>;
