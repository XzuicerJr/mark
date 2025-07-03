import { z } from "zod";

export const emailSchema = z
  .string()
  .email()
  .min(1)
  .transform((email) => email.toLowerCase());

export const signUpSchema = z.object({
  email: emailSchema,
});
