import { useRouterStuff } from "@/components/hooks/use-router-stuff";
import { fetcher } from "@/lib/utils";
import useSWR, { SWRConfiguration } from "swr";
import { HabitProps } from "../types";

export default function useHabits(swrOpts: SWRConfiguration = {}) {
  const { searchParamsObj } = useRouterStuff();

  const endpoint =
    searchParamsObj.archived === "true"
      ? "/api/habits?archived=true"
      : "/api/habits";

  const {
    data: habits,
    isValidating,
    error,
  } = useSWR<HabitProps[]>(endpoint, fetcher, {
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
