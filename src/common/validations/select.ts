import { z } from "zod";

export const selectItemSchema = z.object({
  value: z.string(),
  label: z.string(),
});
