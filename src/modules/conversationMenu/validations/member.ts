import { MemberRole } from "@prisma/client";
import { z } from "zod";
import { AvailableRoles } from "@/common/const";

export const deleteMemberSchema = z.object({
  conversationId: z.string(),
  memberId: z.string(),
});

export const changeRoleSchema = z.object({
  memberId: z.string(),
  conversationId: z.string(),
  role: z.enum<MemberRole, [AvailableRoles, ...AvailableRoles[]]>([
    "VIEW",
    "EDIT",
  ]),
});

export type DeleteMemberFields = z.infer<typeof deleteMemberSchema>;
export type ChangeRoleFields = z.infer<typeof changeRoleSchema>;
