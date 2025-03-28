import { z } from "zod";

export const CreateAccountSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export type CreateAccountSchemaType = z.infer<typeof CreateAccountSchema>;
