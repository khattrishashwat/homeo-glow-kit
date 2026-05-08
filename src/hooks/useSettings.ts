import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/services/api";

export function useSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: async () => {
      const response = await settingsApi.get();
      return response.data;
    },
    staleTime: 1000 * 60 * 30,
  });
}
