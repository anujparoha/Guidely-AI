import { useMutation } from "@tanstack/react-query";
import apiClient from "@/services/api";
import type {
  RoadmapRequest,
  RoadmapOutput,
  ApiResponse,
} from "@/types";

export function useRoadmap() {
  return useMutation({
    mutationFn: async (request: RoadmapRequest): Promise<RoadmapOutput> => {
      const { data } = await apiClient.post<ApiResponse<RoadmapOutput>>(
        "/roadmap",
        request
      );
      return data.data;
    },
  });
}
