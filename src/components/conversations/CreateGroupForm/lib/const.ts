import { conversationSchema } from "@/lib/validations";
import { z } from "zod";

const fieldsSchema = conversationSchema.pick({
  name: true,
  image: true,
});

const memberSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const membersSchema = z.object({
  members: z.array(memberSchema).min(1, {
    message: "Add at least one member",
  }),
});

export const formSchema = fieldsSchema.merge(membersSchema);

export type FormFields = z.infer<typeof formSchema>;
