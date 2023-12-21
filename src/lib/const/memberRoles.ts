import { MemberRole } from "@prisma/client";

type Role = {
  value: MemberRole;
  label: string;
  description: string;
};

export const memberRoles: Role[] = [
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
