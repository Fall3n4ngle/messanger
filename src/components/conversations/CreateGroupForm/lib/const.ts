import { conversationSchema } from "@/lib/validations";
import { z } from "zod";

export const formSchema = conversationSchema.pick({
  name: true,
  image: true,
  members: true,
});

export type FormFields = z.infer<typeof formSchema>;
