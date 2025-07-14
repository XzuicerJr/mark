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
import { Skeleton } from "@/components/ui/skeleton";
import useHabits from "@/lib/swr/use-habits";
import { Archive, ArrowLeft, Check, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback } from "react";

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
  const searchParams = useSearchParams();
  const { habits, isValidating } = useHabits();

  const archived = searchParams.get("archived") === "true";

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Suspense fallback={<Skeleton className="h-9 w-[90.76px]" />}>
          <Filters />
        </Suspense>
        <AddHabit inHeader />
      </div>
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
          <p>No {archived ? "archived" : ""} habits found</p>
          {!archived && <p>Add a habit to get started</p>}
          {!archived ? (
            <AddHabit />
          ) : (
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Go back
              </Link>
            </Button>
          )}
        </div>
      )}
    </>
  );
}
