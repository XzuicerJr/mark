"use server";

import { VerifyEmail } from "@/components/emails/templates/verify-email";
import { EMAIL_OTP_EXPIRY_IN } from "@/lib/auth/constants";
import { generateOTP } from "@/lib/auth/utils";
import z from "@/lib/zod";
import { emailSchema, passwordSchema } from "@/lib/zod/schema/auth";
import { prisma } from "@/prisma";
import { sendResendEmail } from "../email/resend";
import { throwIfAuthenticated } from "./auth/throw-if-authenticated";
import { actionClient } from "./safe-action";

const schema = z.object({
  email: emailSchema,
  password: passwordSchema.optional(),
});

// Send OTP to email to verify account
export const sendOtpAction = actionClient
  .inputSchema(schema)
  .use(throwIfAuthenticated)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    if (email.includes("+") && email.endsWith("@gmail.com")) {
      throw new Error(
        "Email addresses with + are not allowed. Please use another email instead.",
      );
    }

    const isExistingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isExistingUser) {
      throw new Error(
        "User already exists. Please login instead of requesting a new OTP.",
      );
    }

    const code = generateOTP();

    await prisma.emailVerificationToken.deleteMany({
      where: {
        identifier: email,
      },
    });

    await Promise.all([
      prisma.emailVerificationToken.create({
        data: {
          identifier: email,
          token: code,
          expires: new Date(Date.now() + EMAIL_OTP_EXPIRY_IN * 1000),
        },
      }),

      process.env.NODE_ENV === "development"
        ? console.log(`OTP: ${code}`)
        : sendResendEmail({
            subject: `${process.env.NEXT_PUBLIC_APP_NAME}: OTP to verify your account`,
            email,
            react: VerifyEmail({
              email,
              code,
            }),
          }),
    ]);
  });
