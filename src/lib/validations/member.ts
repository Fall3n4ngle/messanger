import { z } from "zod";

export const deleteMemberSchema = z.object({
  conversationId: z.string(),
  memberId: z.string(),
});

export type DeleteMemberFields = z.infer<typeof deleteMemberSchema>;
