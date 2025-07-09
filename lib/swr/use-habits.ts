import { fetcher } from "@/lib/utils";
import useSWR, { SWRConfiguration } from "swr";
import { HabitProps } from "../types";

export default function useHabits(swrOpts: SWRConfiguration = {}) {
  const {
    data: habits,
    isValidating,
    error,
  } = useSWR<HabitProps[]>("/api/habits", fetcher, {
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
