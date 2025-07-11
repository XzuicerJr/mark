import z from "@/lib/zod";
import { deleteHabitLogBodySchema } from "@/lib/zod/schema/habits";
import { prisma } from "@/prisma";

export async function deleteHabitLog(
  props: z.infer<typeof deleteHabitLogBodySchema> & {
    userId: string;
    habitId: string;
  },
) {
  const { userId, id, habitId } = props;

  const habitLog = await prisma.habitLog.delete({
    where: {
      id,
      habit: {
        id: habitId,
        user: {
          id: userId,
        },
      },
    },
  });

  return habitLog;
}
