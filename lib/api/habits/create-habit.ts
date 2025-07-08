import z from "@/lib/zod";
import { createHabitBodySchema } from "@/lib/zod/schema/habits";
import { prisma } from "@/prisma";

export async function createHabit(
  props: z.infer<typeof createHabitBodySchema> & { userId: string },
) {
  const { name, description, startDate, color, icon, userId } = props;

  const response = await prisma.habit.create({
    data: {
      name,
      description,
      startDate: startDate ?? new Date(),
      color: color ?? "blue",
      icon,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return response;
}
