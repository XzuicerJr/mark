import LockAccount from "@/components/emails/templates/lock-account";
import { prisma } from "@/prisma";
import { User } from "@prisma/client";
import { sendResendEmail } from "../email/resend";
import { MAX_LOGIN_ATTEMPTS } from "./constants";

export const incrementLoginAttempts = async (
  user: Pick<User, "id" | "email">,
) => {
  const { invalidLoginAttempts, lockedAt } = await prisma.user.update({
    where: { id: user.id },
    data: {
      invalidLoginAttempts: {
        increment: 1,
      },
    },
    select: {
      lockedAt: true,
      invalidLoginAttempts: true,
    },
  });

  if (!lockedAt && invalidLoginAttempts >= MAX_LOGIN_ATTEMPTS) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lockedAt: new Date(),
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("Your account has been locked");
    } else {
      await sendResendEmail({
        email: user.email,
        subject: "Your account has been locked",
        react: LockAccount({ email: user.email }),
      });
    }
  }

  return {
    invalidLoginAttempts,
    lockedAt,
  };
};

export const exceededLoginAttemptsThreshold = (
  user: Pick<User, "invalidLoginAttempts">,
) => {
  return user.invalidLoginAttempts >= MAX_LOGIN_ATTEMPTS;
};
