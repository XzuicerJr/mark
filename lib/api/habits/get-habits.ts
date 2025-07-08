import z from "@/lib/zod";
import { getHabitsQuerySchema } from "@/lib/zod/schema/habits";
import { prisma } from "@/prisma";

export async function getHabits({
  userId,
}: z.infer<typeof getHabitsQuerySchema>) {
  const habits = await prisma.habit.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return habits;
}
