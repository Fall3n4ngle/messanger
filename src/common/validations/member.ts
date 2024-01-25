import { z } from "zod";
import { selectItemSchema } from "./select";

export const formMembersSchema = z.object({
  members: z.array(selectItemSchema).min(1, {
    message: "Add at least one member",
  }),
});

export type FormMembersFields = z.infer<typeof formMembersSchema>;
