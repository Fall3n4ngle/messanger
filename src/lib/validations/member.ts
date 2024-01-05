import { z } from "zod";

const memberSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const membersSchema = z.object({
  members: z.array(memberSchema).min(1, {
    message: "Add at least one member",
  }),
});

export type MembersFields = z.infer<typeof membersSchema>
