"use client";

import AddHabit from "@/components/add-habit";
import { Habit, HabitProps } from "@/components/habit";
import useHabits from "@/lib/swr/use-habits";

export default function Home() {
  const { habits, isValidating } = useHabits();

  return isValidating ? (
    <div className="flex flex-col items-center justify-center gap-4">
      <p>Loading...</p>
    </div>
  ) : !!habits?.length ? (
    <>
      <AddHabit inHeader />
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {habits.map((habit) => (
          <Habit
            key={`habit-${habit.id}`}
            {...habit}
            color={habit.color as HabitProps["color"]}
          />
        ))}
      </div>
    </>
  ) : (
    <div className="flex flex-col items-center justify-center gap-4">
      <p>No habits found</p>
      <p>Add a habit to get started</p>
      <AddHabit />
    </div>
  );
}
