import axios from "axios";
import { useAuthStore } from "@/store/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/ai`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

// ── Request Interceptor — attach Bearer token ───────────────────────

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor ────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";

      const statusCode = error.response?.status || 500;

      // Auto-logout on 401
      if (statusCode === 401) {
        useAuthStore.getState().logout();
      }

      return Promise.reject({
        success: false,
        error: message,
        statusCode,
      });
    }
    return Promise.reject(error);
  }
);



export async function fetchSSE(
  endpoint: string,
  body: Record<string, unknown>,
  onChunk: (data: { content?: string; done?: boolean }) => void,
  signal?: AbortSignal
): Promise<void> {
  const token = useAuthStore.getState().accessToken;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/api/ai${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal,
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      (errorData as { error?: string }).error || `Request failed with status ${response.status}`
    );
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("data: ")) {
        try {
          const data = JSON.parse(trimmed.slice(6));
          onChunk(data);
        } catch {
  
        }
      }
    }
  }
}

export default apiClient;
