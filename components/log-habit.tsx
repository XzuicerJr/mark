"use client";

import { Button } from "@/components/ui/button";
import { HabitLogProps, HabitProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
import { Check, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";
import { getColor } from "./get-color";

export default function LogHabit({
  habitId,
  color,
  logs,
}: {
  habitId: string;
  color: HabitProps["color"];
  logs: HabitLogProps[];
}) {
  const { theme: themeFromProvider } = useTheme();
  const theme = themeFromProvider as "light" | "dark";

  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isChecked = logs.some((log) => isSameDay(log.date, new Date()));

  useEffect(() => {
    if (isChecked) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 600); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [isChecked]);

  const method = isChecked ? "DELETE" : "POST";
  const body = isChecked
    ? {
        id: logs.find((log) => isSameDay(log.date, new Date()))?.id,
        habitId,
      }
    : { date: new Date(), habitId };

  const handleLogHabit = async () => {
    const response = await fetch(`/api/habits/${habitId}/logs`, {
      method,
      body: JSON.stringify(body),
    });

    if (response.ok) {
      mutate(`/api/habits/${habitId}/logs`);
    } else {
      toast.error("Failed to log habit");
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        className="hover:border-accent-foreground relative size-12 cursor-pointer rounded-xl border"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        style={{
          backgroundColor: isChecked
            ? getColor[color][theme].icon.background
            : getColor[color][theme].log.pending,
        }}
        onClick={() => {
          if (isAnimating) {
            return;
          }

          handleLogHabit();
        }}
      >
        <X
          className={cn(
            "absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-all duration-300",
            isChecked && isHovered && !isAnimating && "opacity-100",
          )}
        />
        <Check
          className={cn(
            "absolute top-1/2 left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
            isPressed && "-rotate-12",
            isAnimating && "animate-elastic-spin",
            isChecked && !isAnimating && isHovered && "opacity-0",
          )}
        />
      </Button>
    </div>
  );
}
