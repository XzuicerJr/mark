import z from "@/lib/zod";
import { getHabitLogsQuerySchema } from "@/lib/zod/schema/habits";
import { prisma } from "@/prisma";

export async function getHabitLogs({
  habitId,
  userId,
}: z.infer<typeof getHabitLogsQuerySchema> & { userId: string }) {
  const logs = await prisma.habitLog.findMany({
    where: {
      habit: {
        id: habitId,
        user: {
          id: userId,
        },
      },
    },
  });

  return logs;
}
