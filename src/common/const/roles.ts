import { MemberRole } from "@prisma/client";

export type AvailableRoles = Exclude<MemberRole, "ADMIN">;

type Role<T> = {
  value: T;
  label: string;
  description: string;
};

export const availableMemberRoles: ReadonlyArray<Role<AvailableRoles>> = [
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

export const allMemberRoles: Role<MemberRole>[] = [
  ...availableMemberRoles,
  {
    label: "Admin",
    value: "ADMIN",
    description: "The owner of a group",
  },
];
