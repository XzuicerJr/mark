"use client";

import AddHabit from "@/components/add-habit";
import { Habit, HabitProps } from "@/components/habit";
import { subDays } from "date-fns";
import { PersonStanding } from "lucide-react";

const habits: HabitProps[] = [
  {
    icon: PersonStanding,
    title: "Walk around the block",
    description: "Go for a short walk to clear the mind",
    startDate: subDays(new Date(), 390),
    color: "green",
  },
  {
    icon: PersonStanding,
    title: "Walk around the block",
    description: "Go for a short walk to clear the mind",
    startDate: new Date("2025-01-01"),
    color: "blue",
  },
  {
    icon: PersonStanding,
    title: "Walk around the block",
    description: "Go for a short walk to clear the mind",
    startDate: subDays(new Date(), 400),
    color: "orange",
  },
  {
    icon: PersonStanding,
    title: "Walk around the block",
    description: "Go for a short walk to clear the mind",
    startDate: new Date("2025-08-10"),
    color: "pink",
  },
  {
    icon: PersonStanding,
    title: "Walk around the block",
    description: "Go for a short walk to clear the mind",
    startDate: new Date("2025-08-10"),
    color: "purple",
  },
  {
    icon: PersonStanding,
    title: "Walk around the block",
    description: "Go for a short walk to clear the mind",
    startDate: new Date("2025-08-10"),
    color: "red",
  },
  {
    icon: PersonStanding,
    title: "Walk around the block",
    description: "Go for a short walk to clear the mind",
    startDate: new Date("2025-08-10"),
    color: "yellow",
  },
];
export default function Home() {
  return (
    <>
      <AddHabit />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {habits.map((habit, idx) => (
          <Habit key={`habit-${idx}`} {...habit} />
        ))}
      </div>
    </>
  );
}
