import { MemberRole } from "@prisma/client";

type Role = {
  value: MemberRole;
  label: string;
  description: string;
};

export const availableMemberRoles: Role[] = [
  {
    label: "Editor",
    value: "EDIT",
    description: "Can edit other member's messages",
  },
  {
    label: "Viewer",
    value: "VIEW",
    description: "Can edit his own messages",
  },
];

export const allMemberRoles: Role[] = [
  ...availableMemberRoles,
  {
    label: "Admin",
    value: "ADMIN",
    description: "The owner of a group",
  },
];
