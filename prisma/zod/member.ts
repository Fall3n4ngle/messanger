import * as z from "zod"
import { MemberRole } from "@prisma/client"
import { CompleteUser, relatedUserSchema, CompleteConversation, relatedConversationSchema } from "./index"

export const memberSchema = z.object({
  id: z.string(),
  role: z.nativeEnum(MemberRole),
  userId: z.string(),
  conversationId: z.string().nullish(),
})

export interface CompleteMember extends z.infer<typeof memberSchema> {
  user: CompleteUser
  conversation?: CompleteConversation | null
}

/**
 * relatedMemberSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedMemberSchema: z.ZodSchema<CompleteMember> = z.lazy(() => memberSchema.extend({
  user: relatedUserSchema,
  conversation: relatedConversationSchema.nullish(),
}))
