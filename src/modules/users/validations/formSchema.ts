import { selectItemSchema } from "@/common/validations/select";
import { z } from "zod";

export const formSchema = z.object({
  conversation: selectItemSchema,
});

export type FormFields = z.infer<typeof formSchema>;
