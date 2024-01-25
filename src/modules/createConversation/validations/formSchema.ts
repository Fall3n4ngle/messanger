import { formMembersSchema } from "@/common/validations";
import { z } from "zod";
import { createConversationSchema } from "./conversation";

export const formSchema = createConversationSchema
  .pick({
    name: true,
    image: true,
  })
  .merge(formMembersSchema);

export type FormFields = z.infer<typeof formSchema>;
