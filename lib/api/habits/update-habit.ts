import z from "@/lib/zod";
import { updateHabitBodySchema } from "@/lib/zod/schema/habits";
import { prisma } from "@/prisma";

export async function updateHabit(
  props: z.infer<typeof updateHabitBodySchema> & {
    userId: string;
    habitId: string;
  },
) {
  const { userId, habitId, ...data } = props;

  const response = await prisma.habit.update({
    where: {
      id: habitId,
      user: {
        id: userId,
      },
    },
    data: {
      ...data,
    },
  });

  return response;
}
