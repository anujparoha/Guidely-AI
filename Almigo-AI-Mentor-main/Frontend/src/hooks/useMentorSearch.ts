import { useMutation } from "@tanstack/react-query";
import { useState, useCallback, useRef, useEffect } from "react";
import apiClient from "@/services/api";
import type {
  MentorSearchRequest,
  MentorSearchResult,
  ApiResponse,
} from "@/types";

export function useMentorSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mutation = useMutation({
    mutationFn: async (
      request: MentorSearchRequest
    ): Promise<MentorSearchResult[]> => {
      const { data } = await apiClient.post<ApiResponse<MentorSearchResult[]>>(
        "/search-mentors",
        request
      );
      return data.data;
    },
  });


  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);


  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      mutation.mutate({ query: debouncedQuery });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const search = useCallback(
    (searchQuery: string) => {
      if (searchQuery.trim()) {
        mutation.mutate({ query: searchQuery });
      }
    },
    [mutation]
  );

  return {
    query,
    setQuery,
    results: mutation.data || [],
    isLoading: mutation.isPending,
    error: mutation.error,
    search,
  };
}
