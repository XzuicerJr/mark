"use server";

import { hashPassword } from "@/lib/auth/password";
import z from "@/lib/zod";
import { signUpSchema } from "@/lib/zod/schema/auth";
import { prisma } from "@/prisma";
import { throwIfAuthenticated } from "./auth/throw-if-authenticated";
import { actionClient } from "./safe-action";

const schema = signUpSchema.extend({
  code: z.string().min(6, "OTP must be 6 characters long."),
});

// Sign up a new user using email and password
export const createUserAccountAction = actionClient
  .inputSchema(schema)
  .use(throwIfAuthenticated)
  .action(async ({ parsedInput }) => {
    const { name, email, password, code } = parsedInput;

    const verificationToken = await prisma.emailVerificationToken.findUnique({
      where: {
        identifier: email,
        token: code,
      },
    });

    if (!verificationToken) {
      throw new Error("Invalid verification code entered.");
    }

    if (verificationToken.expires && verificationToken.expires < new Date()) {
      await prisma.emailVerificationToken.delete({
        where: {
          identifier: email,
          token: code,
        },
      });

      throw new Error("The OTP has expired. Please request a new one.");
    }

    await prisma.emailVerificationToken.delete({
      where: {
        identifier: email,
        token: code,
      },
    });

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: await hashPassword(password),
          emailVerified: new Date(),
        },
      });
    }
  });
