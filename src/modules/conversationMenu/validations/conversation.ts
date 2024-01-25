import { conversationSchema } from "@/common/validations";
import { z } from "zod";

export const editConversationSchema = conversationSchema.pick({
  name: true,
  image: true,
  id: true,
});

export type EditConversationFields = z.infer<typeof editConversationSchema>;
