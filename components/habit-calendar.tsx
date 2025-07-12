"use client";

import { HabitLogProps, HabitProps } from "@/lib/types";
import { isSameDay, isSameMonth, subYears } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
  useState,
} from "react";
import { CalendarDay, Modifiers } from "react-day-picker";
import { toast } from "sonner";
import { mutate } from "swr";
import AddEditHabit from "./add-edit-habit";
import { getColor } from "./get-color";
import LogsGrid from "./logs-grid";
import ModalDelete from "./modal-delete";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import Modal from "./ui/modal";

export default function HabitCalendar({
  habit,
  icon,
  theme,
  color,
  logs,
}: {
  habit: HabitProps;
  icon: React.ReactNode;
  theme: "light" | "dark";
  color: HabitProps["color"];
  logs: HabitLogProps[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [activeMonth, setActiveMonth] = useState<Date | undefined>(new Date());

  return (
    <>
      <Button
        variant="plain"
        size="icon"
        className="hover:border-accent-foreground relative size-12 cursor-pointer rounded-xl border"
        onClick={() => setShowModal(true)}
      >
        <CalendarIcon className="size-4" />
      </Button>
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        icon={icon}
        title={habit.name}
        description={habit.description ?? undefined}
      >
        <LogsGrid
          startDate={habit.startDate}
          color={habit.color}
          theme={theme}
          logs={logs}
        />
        <div className="flex justify-end gap-2">
          <ModalDelete
            small
            onDelete={async () => {
              try {
                const response = await fetch(`/api/habits/${habit.id}`, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

                if (!response.ok) {
                  throw new Error("Failed to create habit");
                }

                mutate("/api/habits");
                toast.success("Habit deleted successfully");
                setShowModal(false);
              } catch (error) {
                console.error(error);
              }
            }}
            title="Delete Habit"
            content={
              <p className="text-sm">
                Are you sure you want to delete this habit? This action cannot
                be undone.
              </p>
            }
          />
          <AddEditHabit props={habit} />
        </div>
        <div className="bg-border h-px w-full" />
        <Calendar
          className="w-full [&_tr]:gap-2"
          fixedWeeks
          mode="single"
          autoFocus
          selected={new Date()}
          disabled={{ after: new Date() }}
          month={activeMonth}
          onMonthChange={(date) => setActiveMonth(date)}
          endMonth={new Date()}
          startMonth={subYears(habit.startDate, 1)}
          modifiers={{
            selected: logs.map((log) => log.date),
          }}
          modifiersClassNames={{
            day: "transition-all duration-300 ease-in-out",
            today:
              "rounded-md bg-transparent [&.rdp-outside]:border-foreground/20 border border-foreground [&&_button]:bg-accent/10 [&&_button]:hover:bg-accent dark:[&_button]:bg-accent/40 dark:[&_button]:hover:bg-accent/50 [&_button]:!text-inherit [&_button]:hover:!text-foreground",
          }}
          components={{
            Day: (props) => (
              <DayComponent
                dayProps={props}
                habitId={habit.id}
                logs={logs}
                color={color}
                theme={theme}
                activeMonth={activeMonth}
                setActiveMonth={setActiveMonth}
              />
            ),
          }}
        />
      </Modal>
    </>
  );
}

function DayComponent({
  dayProps,
  habitId,
  logs,
  color,
  theme,
  activeMonth,
  setActiveMonth,
}: {
  dayProps: {
    day: CalendarDay;
    modifiers: Modifiers;
  } & HTMLAttributes<HTMLDivElement>;
  habitId: string;
  logs: HabitLogProps[];
  color: HabitProps["color"];
  theme: "light" | "dark";
  activeMonth: Date | undefined;
  setActiveMonth: (date: Date | undefined) => void;
}) {
  const log = logs.find((log) => isSameDay(log.date, dayProps.day.date));
  const isSelected = log !== undefined;

  const handleLogHabit = async () => {
    const method = isSelected ? "DELETE" : "POST";
    const body = isSelected
      ? {
          id: log?.id,
          habitId,
        }
      : { date: dayProps.day.date, habitId };

    try {
      const response = await fetch(`/api/habits/${habitId}/logs`, {
        method,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to log habit");
      }

      mutate(`/api/habits/${habitId}/logs`);
    } catch (error) {
      toast.error("Failed to log habit");
    }
  };

  const isAnotherMonth = !isSameMonth(
    dayProps.day.date,
    activeMonth || new Date(),
  );

  const clonedChildren = Children.map(dayProps.children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        // @ts-expect-error - onClick is not a valid prop for the child
        onClick: () => {
          setActiveMonth(dayProps.day.date);
          handleLogHabit();
        },
        ...(isSelected && {
          style: {
            backgroundColor: isAnotherMonth
              ? `${getColor[color][theme].log.pending}87`
              : getColor[color][theme].log.pending,
          } as React.CSSProperties,
        }),
      });
    }
  });

  if (isSelected) {
    return (
      <td className="relative" {...dayProps}>
        {clonedChildren}
        <div
          className="absolute right-[calc(50%+1rem)] bottom-1 z-10 size-1.5 translate-x-[calc(50%+1rem)] rounded-full transition-opacity duration-300 ease-in-out sm:size-2"
          style={{
            backgroundColor: isAnotherMonth
              ? `${getColor[color][theme].log.done}87`
              : getColor[color][theme].log.done,
          }}
        />
      </td>
    );
  }

  return <td {...dayProps}>{clonedChildren}</td>;
}
