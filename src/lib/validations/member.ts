import { z } from "zod";

const formMemberSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const formMembersSchema = z.object({
  members: z.array(formMemberSchema).min(1, {
    message: "Add at least one member",
  }),
});

export type FormMembersFields = z.infer<typeof formMembersSchema>;

export const deleteMemberSchema = z.object({
  conversationId: z.string(),
  memberId: z.string(),
});

export type DeleteMemberFields = z.infer<typeof deleteMemberSchema>;
