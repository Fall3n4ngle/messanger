import { messageSchema } from "@/common/validations";
import { z } from "zod";
import { hasContentOrFile } from "../utils/hasContentOrFile";

export const sendMessageSchema = messageSchema
  .omit({
    id: true,
  })
  .refine(hasContentOrFile, {
    path: ["content", "file"],
  });

export const editMessageSchema = messageSchema
  .omit({
    userId: true,
  })
  .refine(hasContentOrFile, {
    path: ["content", "file"],
  });

export type SendMessageFields = z.infer<typeof sendMessageSchema>;
export type EditMessageFields = z.infer<typeof editMessageSchema>;
