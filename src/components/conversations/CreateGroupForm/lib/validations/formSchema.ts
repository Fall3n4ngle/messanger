import { createConversationSchema, formMembersSchema } from "@/lib/validations";
import { z } from "zod";

export const formSchema = createConversationSchema
  .pick({
    name: true,
    image: true,
  })
  .merge(formMembersSchema);

export type FormFields = z.infer<typeof formSchema>;
