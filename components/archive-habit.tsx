"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Archive, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { mutate } from "swr";

export default function ArchiveHabit({ habitId }: { habitId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleArchive = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ archived: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to archive habit");
      }

      mutate("/api/habits");
      toast.success("Habit archived successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to archive habit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleArchive}
      disabled={isLoading}
    >
      <div className="relative flex size-4 items-center justify-center">
        <Archive
          className={cn(
            "absolute size-4 transition-all ease-in-out",
            isLoading && "opacity-0",
          )}
        />
        <Loader2
          className={cn(
            "absolute size-4 animate-spin opacity-0 transition-all ease-in-out",
            isLoading && "opacity-100",
          )}
        />
      </div>
      <span className="sr-only">Archive habit</span>
    </Button>
  );
}
