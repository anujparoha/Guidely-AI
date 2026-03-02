import { useMutation } from "@tanstack/react-query";
import apiClient from "@/services/api";
import type {
  SummarizeRequest,
  SessionSummaryOutput,
  ApiResponse,
} from "@/types";

export function useSummarize() {
  return useMutation({
    mutationFn: async (
      request: SummarizeRequest
    ): Promise<SessionSummaryOutput> => {
      const { data } = await apiClient.post<ApiResponse<SessionSummaryOutput>>(
        "/summarize",
        request
      );
      return data.data;
    },
  });
}
