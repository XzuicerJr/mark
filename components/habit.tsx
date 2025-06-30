"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  format,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
  addDays,
  isAfter,
  isBefore,
  differenceInDays,
  addYears,
  subYears,
} from "date-fns";
import { LucideProps } from "lucide-react";
import React, { useRef, useEffect } from "react";

export interface HabitProps {
  className?: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  title: string;
  description: string;
  startDate: Date;
  color: "green" | "red" | "yellow" | "blue" | "purple" | "orange" | "pink";
}

interface Color {
  card: string; // background color of the card
  text: string; // text color for the description
  icon: {
    background: string; // background color of the icon
    color: string; // text color of the icon
  };
  log: {
    pending: string; // background color of the log when the habit is not done
    done: string; // background color of the log when the habit is done
  };
}

interface ColorScheme {
  light: Color;
  dark: Color;
}

const getColor: Record<HabitProps["color"], ColorScheme> = {
  green: {
    light: {
      card: "#e6f9ec", // very light green
      text: "#047857", // emerald-700
      icon: {
        background: "#bbf7d0", // green-200
        color: "#047857", // emerald-700
      },
      log: {
        pending: "#d1fae5", // green-100
        done: "#22c55e", // green-500
      },
    },
    dark: {
      card: "#182c1e",
      text: "#6ee7b7",
      icon: {
        background: "#134e2f",
        color: "#6ee7b7",
      },
      log: {
        pending: "#22332b",
        done: "#22c55e",
      },
    },
  },
  red: {
    light: {
      card: "#fef2f2", // rose-50
      text: "#b91c1c", // red-700
      icon: {
        background: "#fecaca", // red-200
        color: "#b91c1c", // red-700
      },
      log: {
        pending: "#fee2e2", // red-100
        done: "#ef4444", // red-500
      },
    },
    dark: {
      card: "#2c1a1a",
      text: "#fca5a5",
      icon: {
        background: "#7f1d1d",
        color: "#fca5a5",
      },
      log: {
        pending: "#3b2323",
        done: "#ef4444",
      },
    },
  },
  yellow: {
    light: {
      card: "#fefce8", // yellow-50
      text: "#b45309", // yellow-700
      icon: {
        background: "#fef08a", // yellow-200
        color: "#b45309", // yellow-700
      },
      log: {
        pending: "#fef9c3", // yellow-100
        done: "#facc15", // yellow-400
      },
    },
    dark: {
      card: "#2c261a",
      text: "#fde68a",
      icon: {
        background: "#b45309",
        color: "#fde68a",
      },
      log: {
        pending: "#3b3523",
        done: "#facc15",
      },
    },
  },
  blue: {
    light: {
      card: "#eff6ff", // blue-50
      text: "#1e40af", // blue-800
      icon: {
        background: "#bfdbfe", // blue-200
        color: "#1e40af", // blue-800
      },
      log: {
        pending: "#dbeafe", // blue-100
        done: "#3b82f6", // blue-500
      },
    },
    dark: {
      card: "#1a2234",
      text: "#93c5fd",
      icon: {
        background: "#1e3a8a",
        color: "#93c5fd",
      },
      log: {
        pending: "#23293b",
        done: "#3b82f6",
      },
    },
  },
  purple: {
    light: {
      card: "#f5f3ff", // purple-50
      text: "#6d28d9", // purple-700
      icon: {
        background: "#ddd6fe", // purple-200
        color: "#6d28d9", // purple-700
      },
      log: {
        pending: "#ede9fe", // purple-100
        done: "#a78bfa", // purple-400
      },
    },
    dark: {
      card: "#231a2c",
      text: "#c4b5fd",
      icon: {
        background: "#6d28d9",
        color: "#c4b5fd",
      },
      log: {
        pending: "#2e2340",
        done: "#a78bfa",
      },
    },
  },
  orange: {
    light: {
      card: "#fff7ed", // orange-50
      text: "#c2410c", // orange-700
      icon: {
        background: "#fdba74", // orange-200
        color: "#c2410c", // orange-700
      },
      log: {
        pending: "#ffedd5", // orange-100
        done: "#fb923c", // orange-400
      },
    },
    dark: {
      card: "#2c231a",
      text: "#fdba74",
      icon: {
        background: "#ea580c",
        color: "#fdba74",
      },
      log: {
        pending: "#3b2e23",
        done: "#f59e42",
      },
    },
  },
  pink: {
    light: {
      card: "#fdf2f8", // pink-50
      text: "#be185d", // pink-700
      icon: {
        background: "#fbcfe8", // pink-200
        color: "#be185d", // pink-700
      },
      log: {
        pending: "#fce7f3", // pink-100
        done: "#ec4899", // pink-500
      },
    },
    dark: {
      card: "#2c1a23",
      text: "#f9a8d4",
      icon: {
        background: "#be185d",
        color: "#f9a8d4",
      },
      log: {
        pending: "#3b2330",
        done: "#ec4899",
      },
    },
  },
};

export function Habit({
  className,
  icon: Icon,
  title,
  description,
  startDate,
  color,
}: HabitProps) {
  const theme = "dark";
  let days: Date[] = [];

  days = Array.from(
    { length: differenceInDays(addYears(startDate, 1), startDate) + 1 },
    (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      return date;
    }
  );

  // // if the current day is after the last day, add the needed days to the days array
  if (isAfter(new Date(), days[days.length - 1])) {
    const daysToAdd = differenceInDays(new Date(), days[days.length - 1]);

    days.push(
      ...Array.from({ length: daysToAdd }, (_, i) =>
        addDays(days[days.length - 1], i + 1)
      )
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
          className="rounded-xl p-2 md:p-3 flex items-center justify-center"
          style={{
            backgroundColor: getColor[color][theme].icon.background,
          }}
        >
          <Icon className="size-6 fill-white" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-white text-xl font-medium">
            {title}
          </CardTitle>
          <CardDescription
            className="text-base"
            style={{
              color: getColor[color][theme].text,
            }}
          >
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-0 p-1.5">
        {isAfter(startDate, new Date()) ? (
          <div
            className="flex flex-col items-center justify-center rounded-lg h-[6.375rem]"
            style={{
              backgroundColor: getColor[color][theme].icon.background,
              color: "#fff",
            }}
          >
            <div
              className="text-lg font-semibold mb-1"
              style={{ color: "#fff" }}
            >
              This habit hasn't started yet
            </div>
            <div className="text-sm text-[#ffffffcc]">
              Start date: {format(startDate, "MMM d, yyyy")}
            </div>
          </div>
        ) : (
          <div className="overflow-x-hidden">
            <table className="border-separate border-spacing-0.5 w-full relative float-right">
              <tbody>
                {daysOfWeek.map((weekday, rowIdx) => (
                  <tr key={`${weekday.short}-${rowIdx}`}>
                    {weeks.map((week, colIdx) => {
                      const date = week[rowIdx];
                      const isDone =
                        Math.random() > 0.5 && isBefore(date, new Date());

                      return (
                        <td key={colIdx}>
                          {date && (
                            <div
                              title={format(date, "MMM d, yyyy")}
                              data-date={format(date, "yyyy-MM-dd")}
                              className={cn(
                                "rounded-[3px] size-2.5",
                                isToday(date) && "border-1 border-white"
                              )}
                              style={{
                                backgroundColor: isDone
                                  ? getColor[color][theme].log.done
                                  : getColor[color][theme].log.pending,
                              }}
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
