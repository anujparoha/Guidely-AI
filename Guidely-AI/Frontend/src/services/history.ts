import apiClient from "@/services/api";
import type {
  ConversationHistory,
  SavedRoadmapHistory,
  SavedSummaryHistory,
  SearchHistoryEntry,
  ApiResponse,
} from "@/types";

export async function getConversations(): Promise<ConversationHistory[]> {
  const { data } = await apiClient.get<ApiResponse<ConversationHistory[]>>(
    "/conversations"
  );
  return data.data;
}

export async function getConversationById(
  id: string
): Promise<ConversationHistory> {
  const { data } = await apiClient.get<ApiResponse<ConversationHistory>>(
    `/conversations/${id}`
  );
  return data.data;
}

export async function getRoadmaps(): Promise<SavedRoadmapHistory[]> {
  const { data } = await apiClient.get<ApiResponse<SavedRoadmapHistory[]>>(
    "/roadmaps"
  );
  return data.data;
}

export async function getSummaries(): Promise<SavedSummaryHistory[]> {
  const { data } = await apiClient.get<ApiResponse<SavedSummaryHistory[]>>(
    "/summaries"
  );
  return data.data;
}

export async function getSearchHistory(): Promise<SearchHistoryEntry[]> {
  const { data } = await apiClient.get<ApiResponse<SearchHistoryEntry[]>>(
    "/search-history"
  );
  return data.data;
}
