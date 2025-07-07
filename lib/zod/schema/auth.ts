import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(1000, "Password must be less than 1000 characters")
  .regex(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
    "Password must contain at least one number, one uppercase, and one lowercase letter",
  );

export const emailSchema = z
  .string()
  .email()
  .min(1)
  .transform((email) => email.toLowerCase());

export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: emailSchema,
  password: passwordSchema,
});
