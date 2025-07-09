import { ApiError } from "@/lib/api/errors";
import { deleteHabitLog } from "@/lib/api/habits/detele-habit-log";
import { getHabitLogs } from "@/lib/api/habits/get-habit-logs";
import { logHabit } from "@/lib/api/habits/log-habit";
import { parseRequestBody } from "@/lib/api/utils";
import { withSession } from "@/lib/auth/session";
import {
  deleteHabitLogBodySchema,
  logHabitBodySchema,
} from "@/lib/zod/schema/habits";
import { NextResponse } from "next/server";

// GET /api/habits/[id] – get logs for a habit
export const GET = withSession(async ({ session, params }) => {
  const { id } = params;

  if (!id) {
    throw new ApiError({
      code: "bad_request",
      message: "Habit ID is required",
    });
  }

  const response = await getHabitLogs({
    habitId: id,
    userId: session.user.id,
  });

  return NextResponse.json(response);
});

// POST /api/habits/[id] – log day for the habit
export const POST = withSession(async ({ session, req }) => {
  const body = logHabitBodySchema.parse(await parseRequestBody(req));

  try {
    const response = await logHabit({
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

// DELETE /api/habits/[id] – delete day for the habit
export const DELETE = withSession(async ({ session, params, req }) => {
  const { id } = params;

  if (!id) {
    throw new ApiError({
      code: "bad_request",
      message: "Habit ID is required",
    });
  }

  const body = deleteHabitLogBodySchema.parse(await parseRequestBody(req));

  const response = await deleteHabitLog({
    id: body.id,
    habitId: id,
    userId: session.user.id,
  });

  return NextResponse.json(response);
});
