import { z } from "zod";

const memberSchema = z.object({
  id: z.string(),
});

export const conversationSchema = z.object({
  id: z.string(),
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, {
      message: "Name must be at least 2 characters",
    }),
  image: z.string().optional().nullable(),
  members: memberSchema.array().min(1, {
    message: "Add at least one member",
  }),
});

export const addMembersSchema = conversationSchema.pick({
  members: true,
  id: true,
});

export type AddMembersFields = z.infer<typeof addMembersSchema>;
