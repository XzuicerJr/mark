import { fetcher } from "@/lib/utils";
import { HabitLog } from "@prisma/client";
import useSWR, { SWRConfiguration } from "swr";

export default function useHabitLogs(
  habitId: string,
  swrOpts: SWRConfiguration = {},
) {
  const {
    data: logs,
    isValidating,
    error,
  } = useSWR<HabitLog[]>(`/api/habits/${habitId}`, fetcher, {
    dedupingInterval: 20000,
    revalidateOnFocus: false,
    keepPreviousData: true,
    ...swrOpts,
  });

  return {
    logs,
    isValidating,
    error,
  };
}
