import { ApiError } from "@/lib/api/errors";
import { createHabit } from "@/lib/api/habits/create-habit";
import { getHabits } from "@/lib/api/habits/get-habits";
import { parseRequestBody } from "@/lib/api/utils";
import { withSession } from "@/lib/auth/session";
import { createHabitBodySchema } from "@/lib/zod/schema/habits";
import { NextResponse } from "next/server";

// GET /api/habits – get all habits for a user
export const GET = withSession(async ({ session, searchParams }) => {
  const response = await getHabits({
    userId: session.user.id,
    archived: searchParams.archived === "true",
  });

  return NextResponse.json(response);
});

// POST /api/habits – create a new habit
export const POST = withSession(async ({ session, req }) => {
  const body = createHabitBodySchema.parse(await parseRequestBody(req));

  try {
    const response = await createHabit({
      ...body,
      userId: session.user.id,
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
