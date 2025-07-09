import z from "@/lib/zod";
import { logHabitBodySchema } from "@/lib/zod/schema/habits";
import { prisma } from "@/prisma";

export async function logHabit(
  props: z.infer<typeof logHabitBodySchema> & { userId: string },
) {
  const { habitId, date, userId } = props;

  const habit = await prisma.habit.findUnique({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!habit) {
    throw new Error("Habit not found");
  }

  const response = await prisma.habitLog.create({
    data: {
      habit: {
        connect: {
          id: habitId,
        },
      },
      date,
    },
  });

  return response;
}
