
// ── Auth Types ──────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

// ── Chat Types ──────────────────────────────────────────────────────

export interface ChatMessage {

  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface ChatRequest {
  conversationId: string;
  message: string;
}

export interface ChatStreamChunk {
  content?: string;
  done?: boolean;
}



export interface RoadmapPhase {
  phase: string;
  topics: string[];
  resources: string[];
}

export interface RoadmapOutput {
  title: string;
  duration: string;
  phases: RoadmapPhase[];
}

export interface RoadmapRequest {
  goal: string;
  currentSkills: string[];
  timeline: string;
}



export interface SessionSummaryOutput {
  summary: string;
  keyTakeaways: string[];
  actionItems: string[];
}

export interface SummarizeRequest {
  transcript: string;
}

// ── Mentor Search Types ─────────────────────────────────────────────

export interface Mentor {
  id: string;
  name: string;
  email: string;
  bio: string;
  skills: string[];
  expertise: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MentorSearchResult {
  mentor: Mentor;
  similarityScore: number;
}

export interface MentorSearchRequest {
  query: string;
  topK?: number;
}

// ── API Response Wrapper ────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  statusCode: number;
}

// ── History Types ───────────────────────────────────────────────────

export interface ConversationHistory {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    role: "USER" | "ASSISTANT";
    content: string;
    createdAt: string;
  }[];
}

export interface SavedRoadmapHistory {
  id: string;
  goal: string;
  currentSkills: string[];
  timeline: string;
  result: RoadmapOutput;
  createdAt: string;
}

export interface SavedSummaryHistory {
  id: string;
  transcript: string;
  result: SessionSummaryOutput;
  createdAt: string;
}

export interface SearchHistoryEntry {
  id: string;
  query: string;
  topK: number;
  resultIds: string[];
  createdAt: string;
}
