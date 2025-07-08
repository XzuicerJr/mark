import { ApiError } from "@/lib/api/errors";
import { parseRequestBody } from "@/lib/api/utils";
import { withSession } from "@/lib/auth/session";
import { createHabitBodySchema } from "@/lib/zod/schema/habits";
import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

// POST /api/habits – create a new habit
export const POST = withSession(async ({ session, req }) => {
  const body = createHabitBodySchema.parse(await parseRequestBody(req));

  try {
    const response = await prisma.habit.create({
      data: {
        ...body,
        color: body.color ?? "blue",
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    throw new ApiError({
      code: "unprocessable_entity",
      message: "Failed to create habit",
    });
  }
});
