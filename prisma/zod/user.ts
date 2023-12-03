import * as z from "zod"
import { CompleteMessage, relatedMessageSchema, CompleteConversation, relatedConversationSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  name: z.string(),
  image: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  sentMessages: CompleteMessage[]
  seenMessages: CompleteMessage[]
  conversation: CompleteConversation[]
  createdConversations: CompleteConversation[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  sentMessages: relatedMessageSchema.array(),
  seenMessages: relatedMessageSchema.array(),
  conversation: relatedConversationSchema.array(),
  createdConversations: relatedConversationSchema.array(),
}))
