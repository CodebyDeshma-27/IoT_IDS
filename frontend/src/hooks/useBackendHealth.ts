import { useQuery } from "@tanstack/react-query";
import { api, apiQueryKeys } from "@/lib/api-client";

/**
 * Live backend status from GET /health. Never faked — while the request is in
 * flight or failing, the UI reports "Backend Disconnected".
 */
export function useBackendHealth() {
  const query = useQuery({
    queryKey: apiQueryKeys.health,
    queryFn: api.health,
    retry: false,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
    staleTime: 10_000,
  });

  return {
    connected: query.isSuccess,
    checking: query.isPending || query.isFetching,
    data: query.data,
    refetch: query.refetch,
  };
}
