"use client";

import AddHabit from "@/components/add-edit-habit";
import { Habit } from "@/components/habit";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useHabits from "@/lib/swr/use-habits";
import { Archive, Check, Settings2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }

      return params.toString();
    },
    [searchParams],
  );

  const archived = searchParams.get("archived") === "true";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Filters
          <Settings2 className="ml-auto size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side="bottom"
        align="start"
      >
        <DropdownMenuItem
          onClick={() => {
            const newSearchParams = createQueryString(
              "archived",
              archived ? null : "true",
            );
            router.push(`/?${newSearchParams}`);
          }}
        >
          <Archive className="mr-2 size-4" />
          Archived
          {archived && <Check className="ml-auto size-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Home() {
  const { habits, isValidating } = useHabits();

  return (
    <>
      {habits?.length && (
        <div className="mb-4 flex items-center justify-between">
          <Filters />
          <AddHabit inHeader />
        </div>
      )}
      {isValidating ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <p>Loading...</p>
        </div>
      ) : !!habits?.length ? (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {habits.map((habit) => (
            <Habit key={`habit-${habit.id}`} {...habit} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <p>No habits found</p>
          <p>Add a habit to get started</p>
          <AddHabit />
        </div>
      )}
    </>
  );
}
