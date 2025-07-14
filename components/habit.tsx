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
import { HabitProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, isAfter } from "date-fns";
import { icons } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { mutate } from "swr";
import AddEditHabit from "./add-edit-habit";
import { getColor } from "./get-color";
import HabitCalendar from "./habit-calendar";
import LogHabit from "./log-habit";
import LogsGrid from "./logs-grid";
import ModalDelete from "./modal-delete";
import { Button } from "./ui/button";

export function Habit(props: HabitProps & { className?: string }) {
  const { id, className, icon, name, description, startDate, color } = props;

  const { logs } = useHabitLogs(id);

  const { theme: themeFromProvider } = useTheme();
  const theme = themeFromProvider as "light" | "dark";

  const Icon = icons[icon as keyof typeof icons];

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
          <CardTitle className="text-foreground text-base font-medium md:text-lg">
            {name}
          </CardTitle>
          <CardDescription
            className="text-sm leading-tight md:text-base"
            style={{
              color: getColor[color][theme].text,
            }}
          >
            {description}
          </CardDescription>
        </div>

        {!props.archived &&
          (!isAfter(startDate, new Date()) ? (
            <CardAction className="flex flex-row gap-2">
              <HabitCalendar
                habit={props}
                icon={<Icon className="size-6" />}
                theme={theme}
                color={color}
                logs={logs || []}
              />
              <LogHabit habitId={id} color={color} logs={logs || []} />
            </CardAction>
          ) : (
            <AddEditHabit props={props} inHeader />
          ))}
      </CardHeader>
      <CardContent className="p-1.5 pt-0">
        {props.archived ? (
          <div className="flex flex-row items-center justify-end gap-2">
            <ModalDelete
              onDelete={async () => {
                try {
                  const response = await fetch(`/api/habits/${id}`, {
                    method: "DELETE",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });

                  if (!response.ok) {
                    throw new Error("Failed to delete habit");
                  }

                  mutate("/api/habits");
                  toast.success("Habit deleted successfully");
                } catch (error) {
                  console.error(error);
                }
              }}
              title={`Delete "${name}"`}
              content={
                <p>
                  Are you sure you want to delete this habit? This action cannot
                  be undone.
                </p>
              }
            />
            <Button
              onClick={async () => {
                try {
                  const response = await fetch(`/api/habits/${id}`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ archived: false }),
                  });

                  if (!response.ok) {
                    throw new Error("Failed to restore habit");
                  }

                  mutate("/api/habits");
                  toast.success("Habit restored successfully");
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              Restore
            </Button>
          </div>
        ) : isAfter(startDate, new Date()) ? (
          <div
            className="text-foreground flex h-[6.375rem] flex-col items-center justify-center rounded-lg"
            style={{
              backgroundColor: getColor[color][theme].icon.background,
            }}
          >
            <div className="mb-1 text-base font-semibold md:text-lg">
              This habit hasn&apos;t started yet
            </div>
            <div className="text-xs md:text-sm">
              Start date: {format(startDate, "MMM d, yyyy")}
            </div>
          </div>
        ) : (
          <LogsGrid
            startDate={startDate}
            color={color}
            theme={theme}
            logs={logs || []}
          />
        )}
      </CardContent>
    </Card>
  );
}
