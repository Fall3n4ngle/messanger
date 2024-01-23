import { z } from "zod";

export const formSchema = z.object({
  conversationId: z
    .string({
      required_error: "Choose conversation",
    })
    .uuid(),
});

export type FormFields = z.infer<typeof formSchema>;
