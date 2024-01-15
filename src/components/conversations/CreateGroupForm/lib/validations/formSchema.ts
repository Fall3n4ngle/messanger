import { createConversationSchema } from "@/lib/validations";
import { z } from "zod";

const memberSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const membersSchema = z.object({
  members: z.array(memberSchema).min(1, {
    message: "Add at least one member",
  }),
});

export type MembersFields = z.infer<typeof membersSchema>;

export const formSchema = createConversationSchema
  .pick({
    name: true,
    image: true,
  })
  .merge(membersSchema);

export type FormFields = z.infer<typeof formSchema>;
