import z from "@/lib/zod";
import { accountUpdateSchema } from "@/lib/zod/schema/account";
import { prisma } from "@/prisma";
import { ApiError } from "../errors";

export async function updateUser(
  props: z.infer<typeof accountUpdateSchema> & { userId: string },
) {
  const { name, userId } = props;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError({
      code: "not_found",
      message: "User not found",
    });
  }

  const response = await prisma.user.update({
    data: {
      ...(name && { name }),
    },
    where: {
      id: userId,
    },
  });

  return response;
}
