import { updateUser } from "@/lib/api/user/update-user";
import { withSession } from "@/lib/auth";
import { accountUpdateSchema } from "@/lib/zod/schema/account";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

// PATCH /api/user – edit a specific user
export const PATCH = withSession(async ({ req, session }) => {
  const { name } = await accountUpdateSchema.parseAsync(await req.json());

  console.log(name);

  const user = await updateUser({
    userId: session.user.id,
    name,
  });

  return NextResponse.json(user);
});

export const PUT = PATCH;

// DELETE /api/user – delete a specific user
export const DELETE = withSession(async ({ session }) => {
  const user = await prisma.user.delete({
    where: {
      id: session.user.id,
    },
  });

  return NextResponse.json(user);
});
