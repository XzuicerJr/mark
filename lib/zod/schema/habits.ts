import z from "@/lib/zod";

export const getHabitsQuerySchema = z.object({
  userId: z.string(),
  archived: z.boolean().default(false).optional(),
});

export const createHabitBodySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable(),
  startDate: z.string().describe("The date the habit starts"),
  color: z
    .enum(["green", "red", "yellow", "blue", "purple", "orange", "pink"])
    .default("blue")
    .optional()
    .describe("The color of the habit"),
  icon: z.string(),
  archived: z.boolean().default(false).optional(),
});

export const updateHabitBodySchema = createHabitBodySchema.partial();

export const logHabitBodySchema = z.object({
  habitId: z.string(),
  date: z.string(),
});

export const getHabitLogsQuerySchema = z.object({
  habitId: z.string(),
});

export const deleteHabitLogBodySchema = z.object({
  id: z.string(),
});
