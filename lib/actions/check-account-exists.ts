"use server";

import { emailSchema } from "@/lib/zod/auth";
import { prisma } from "@/prisma";
import { z } from "zod";
import { throwIfAuthenticated } from "./auth/throw-if-authenticated";
import { actionClient } from "./safe-action";

const schema = z.object({
  email: emailSchema,
});

// Check if account exists
export const checkAccountExistsAction = actionClient
  .inputSchema(schema)
  .use(throwIfAuthenticated)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    return {
      accountExists: !!user,
    };
  });
