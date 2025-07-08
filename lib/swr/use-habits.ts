import { fetcher } from "@/lib/utils";
import { Habit } from "@prisma/client";
import useSWR, { SWRConfiguration } from "swr";

export default function useHabits(swrOpts: SWRConfiguration = {}) {
  const {
    data: habits,
    isValidating,
    error,
  } = useSWR<Habit[]>("/api/habits", fetcher, {
    dedupingInterval: 20000,
    revalidateOnFocus: false,
    keepPreviousData: true,
    ...swrOpts,
  });

  return {
    habits,
    isValidating,
    error,
  };
}
