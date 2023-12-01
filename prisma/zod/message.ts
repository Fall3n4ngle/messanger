import * as z from "zod"
import { CompleteConversation, relatedConversationSchema, CompleteUser, relatedUserSchema } from "./index"

export const messageSchema = z.object({
  id: z.string(),
  content: z.string().nullish(),
  file: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  conversationId: z.string(),
  senderId: z.string().nullish(),
})

export interface CompleteMessage extends z.infer<typeof messageSchema> {
  conversation: CompleteConversation
  sentBy?: CompleteUser | null
  seenBy: CompleteUser[]
}

/**
 * relatedMessageSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedMessageSchema: z.ZodSchema<CompleteMessage> = z.lazy(() => messageSchema.extend({
  conversation: relatedConversationSchema,
  sentBy: relatedUserSchema.nullish(),
  seenBy: relatedUserSchema.array(),
}))
