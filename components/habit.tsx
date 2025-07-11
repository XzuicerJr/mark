"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useHabitLogs from "@/lib/swr/use-habit-logs";
import { HabitLogProps, HabitProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  isToday,
  startOfWeek,
  subYears,
} from "date-fns";
import { icons } from "lucide-react";
import { useTheme } from "next-themes";
import AddEditHabit from "./add-edit-habit";
import { getColor } from "./get-color";
import LogHabit from "./log-habit";

export function Habit(props: HabitProps & { className?: string }) {
  const { id, className, icon, name, description, startDate, color } = props;

  const { logs } = useHabitLogs(id);

  const { theme: themeFromProvider } = useTheme();
  const theme = themeFromProvider as "light" | "dark";

  let days: Date[] = [];

  const dates = eachDayOfInterval({
    start: subYears(startDate, 1),
    end: startDate,
  });

  days = Array.from({ length: dates.length }, (_, i) => {
    const date = dates[i];
    return date;
  });

  // // if the current day is after the last day, add the needed days to the days array
  if (isAfter(new Date(), days[days.length - 1])) {
    const daysToAdd = differenceInDays(new Date(), days[days.length - 1]);

    days.push(
      ...Array.from({ length: daysToAdd }, (_, i) =>
        addDays(days[days.length - 1], i + 1),
      ),
    );
  }

  // Group days by columns (weeks)
  const weeks: Date[][] = [];
  let week: Date[] = Array(7).fill(null);

  days.forEach((date, idx) => {
    const dayOfWeek = date.getDay();
    week[dayOfWeek] = date;

    // If Sunday or last day, push the week and start a new one
    if (dayOfWeek === 6 || idx === days.length - 1) {
      weeks.push(week);
      week = Array(7).fill(null);
    }
  });

  const Icon = icons[icon as keyof typeof icons];

  const daysOfWeek = eachDayOfInterval({
    start: startOfWeek(startDate),
    end: endOfWeek(startDate),
  }).map((day) => ({
    index: day.getDay(),
    short: format(day, "EEE"),
    long: format(day, "EEEE"),
  }));

  return (
    <Card
      className={cn("flex flex-col gap-2 border-none p-0", className)}
      style={{
        backgroundColor: getColor[color][theme].card,
      }}
    >
      <CardHeader className="flex flex-row items-start gap-4 p-2">
        <div
          className="flex items-center justify-center rounded-xl p-2 md:p-3"
          style={{
            backgroundColor: getColor[color][theme].icon.background,
          }}
        >
          <Icon className="text-foreground size-6" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-foreground text-xl font-medium">
            {name}
          </CardTitle>
          <CardDescription
            className="text-base leading-tight"
            style={{
              color: getColor[color][theme].text,
            }}
          >
            {description}
          </CardDescription>
        </div>
        <CardAction className="flex flex-row gap-2">
          <AddEditHabit props={props} />
          {!isAfter(startDate, new Date()) && (
            <LogHabit habitId={id} color={color} logs={logs || []} />
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="p-1.5 pt-0">
        {isAfter(startDate, new Date()) ? (
          <div
            className="text-foreground flex h-[6.375rem] flex-col items-center justify-center rounded-lg"
            style={{
              backgroundColor: getColor[color][theme].icon.background,
            }}
          >
            <div className="mb-1 text-lg font-semibold">
              This habit hasn&apos;t started yet
            </div>
            <div className="text-sm">
              Start date: {format(startDate, "MMM d, yyyy")}
            </div>
          </div>
        ) : (
          <div className="overflow-x-hidden">
            <table className="relative float-right w-full border-separate border-spacing-0.5">
              <tbody>
                {daysOfWeek.map((weekday, rowIdx) => (
                  <tr key={`${weekday.short}-${rowIdx}`}>
                    {weeks.map((week, colIdx) => {
                      const date = week[rowIdx];

                      return (
                        <td key={colIdx}>
                          {date && (
                            <DateCell
                              date={date}
                              color={color}
                              theme={theme}
                              logs={logs || []}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DateCell({
  date,
  color,
  theme,
  logs,
}: {
  date: Date;
  color: HabitProps["color"];
  theme: "light" | "dark";
  logs: HabitLogProps[];
}) {
  const isChecked = logs.some((log) => isSameDay(log.date, date));

  return (
    <div
      title={format(date, "MMM d, yyyy")}
      data-date={format(date, "yyyy-MM-dd")}
      className={cn(
        "size-2.5 rounded-[3px]",
        isToday(date) && "border-foreground border-1",
      )}
      style={{
        backgroundColor: isChecked
          ? getColor[color][theme].log.done
          : getColor[color][theme].log.pending,
      }}
    />
  );
}
