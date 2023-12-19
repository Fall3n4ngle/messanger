import * as z from "zod"
import { CompleteConversation, relatedConversationSchema, CompleteMember, relatedMemberSchema } from "./index"

export const userSchema = z.object({
  id: z.string(),
  clerkId: z.string(),
  name: z.string(),
  image: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUser extends z.infer<typeof userSchema> {
  conversations: CompleteConversation[]
  member: CompleteMember[]
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() => userSchema.extend({
  conversations: relatedConversationSchema.array(),
  member: relatedMemberSchema.array(),
}))
