"use client";

import AddHabit from "@/components/add-edit-habit";
import { Habit } from "@/components/habit";
import { useRouterStuff } from "@/components/hooks/use-router-stuff";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useHabits from "@/lib/swr/use-habits";
import { cn } from "@/lib/utils";
import { Archive, ArrowLeft, Check, Settings2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function Filters() {
  const { queryParams, searchParamsObj } = useRouterStuff();

  return (
    <div className="flex items-center gap-2">
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
              queryParams(
                searchParamsObj.archived === "true"
                  ? { del: ["archived"] }
                  : { set: { archived: "true" } },
              );
            }}
          >
            <Archive className="mr-2 size-4" />
            Archived
            {searchParamsObj.archived === "true" && (
              <Check className="ml-auto size-4" />
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* TODO: Change this for Tabs */}
      <Button
        onClick={() => {
          queryParams(!!searchParamsObj.view ? { del: ["view"] } : {});
        }}
      >
        Full
      </Button>
      <Button
        onClick={() => {
          queryParams({ set: { view: "month" } });
        }}
      >
        Month
      </Button>
    </div>
  );
}

function HomeView() {
  const { searchParamsObj } = useRouterStuff();
  const { habits, isValidating } = useHabits();

  const archived = searchParamsObj.archived === "true";
  const monthView = searchParamsObj.view === "month";

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Filters />
        <AddHabit inHeader />
      </div>
      {isValidating ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <p>Loading...</p>
        </div>
      ) : !!habits?.length ? (
        <div
          className={cn(
            "xxl:grid-cols-3! grid grid-cols-1 gap-2 md:grid-cols-2", // Full View
            monthView && "flex flex-wrap items-center",
          )}
        >
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

export default function HomeClient() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeView />
    </Suspense>
  );
}
