import { prisma } from "@/prisma";

export async function deleteHabit(props: { userId: string; habitId: string }) {
  const { habitId, userId } = props;

  const response = await prisma.habit.delete({
    where: {
      id: habitId,
      user: {
        id: userId,
      },
    },
  });

  return response;
}
