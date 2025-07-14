import { fetcher } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import useSWR, { SWRConfiguration } from "swr";
import { HabitProps } from "../types";

export default function useHabits(swrOpts: SWRConfiguration = {}) {
  const searchParams = useSearchParams();

  const {
    data: habits,
    isValidating,
    error,
  } = useSWR<HabitProps[]>(`/api/habits?${searchParams.toString()}`, fetcher, {
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
