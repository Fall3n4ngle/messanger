import * as z from "zod"
import { CompleteMessage, relatedMessageSchema, CompleteUser, relatedUserSchema, CompleteMember, relatedMemberSchema } from "./index"

export const conversationSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullish(),
  isGroup: z.boolean(),
  lastMessageAt: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
})

export interface CompleteConversation extends z.infer<typeof conversationSchema> {
  messages: CompleteMessage[]
  user: CompleteUser
  members: CompleteMember[]
}

/**
 * relatedConversationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedConversationSchema: z.ZodSchema<CompleteConversation> = z.lazy(() => conversationSchema.extend({
  messages: relatedMessageSchema.array(),
  user: relatedUserSchema,
  members: relatedMemberSchema.array(),
}))
