import * as z from "zod"
import { CompleteUser, relatedUserSchema, CompleteMessage, relatedMessageSchema } from "./index"

export const conversationSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullish(),
  lastMessageAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteConversation extends z.infer<typeof conversationSchema> {
  users: CompleteUser[]
  messages: CompleteMessage[]
}

/**
 * relatedConversationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedConversationSchema: z.ZodSchema<CompleteConversation> = z.lazy(() => conversationSchema.extend({
  users: relatedUserSchema.array(),
  messages: relatedMessageSchema.array(),
}))
