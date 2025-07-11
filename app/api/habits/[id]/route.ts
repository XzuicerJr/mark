import { ApiError } from "@/lib/api/errors";
import { deleteHabit } from "@/lib/api/habits/delete-habit";
import { updateHabit } from "@/lib/api/habits/update-habit";
import { parseRequestBody } from "@/lib/api/utils";
import { withSession } from "@/lib/auth/session";
import { updateHabitBodySchema } from "@/lib/zod/schema/habits";
import { NextResponse } from "next/server";

// PATCH /api/habits/[id] – update habit
export const PATCH = withSession(async ({ session, req, params }) => {
  const { id } = params;

  if (!id) {
    throw new ApiError({
      code: "bad_request",
      message: "Habit ID is required",
    });
  }

  const body = updateHabitBodySchema.parse(await parseRequestBody(req));

  try {
    const response = await updateHabit({
      userId: session.user.id,
      habitId: id,
      ...body,
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

// DELETE /api/habits/[id] – delete habit
export const DELETE = withSession(async ({ session, params }) => {
  const { id } = params;

  if (!id) {
    throw new ApiError({
      code: "bad_request",
      message: "Habit ID is required",
    });
  }

  const response = await deleteHabit({
    habitId: id,
    userId: session.user.id,
  });

  return NextResponse.json(response);
});
