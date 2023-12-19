import * as z from "zod"
import { CompleteConversation, relatedConversationSchema, CompleteMember, relatedMemberSchema } from "./index"

export const messageSchema = z.object({
  id: z.string(),
  content: z.string().nullish(),
  file: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  conversationId: z.string(),
  memberId: z.string(),
})

export interface CompleteMessage extends z.infer<typeof messageSchema> {
  conversation: CompleteConversation
  member: CompleteMember
}

/**
 * relatedMessageSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedMessageSchema: z.ZodSchema<CompleteMessage> = z.lazy(() => messageSchema.extend({
  conversation: relatedConversationSchema,
  member: relatedMemberSchema,
}))
