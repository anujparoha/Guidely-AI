import { create } from "zustand";
import type { ChatMessage } from "@/types";

interface ChatState {
  messages: ChatMessage[];
  conversationId: string;
  isStreaming: boolean;
  streamingContent: string;


  addMessage: (message: ChatMessage) => void;
  updateStreamingContent: (content: string) => void;
  appendStreamingContent: (chunk: string) => void;
  finalizeStreaming: () => void;
  setIsStreaming: (streaming: boolean) => void;
  setConversationId: (id: string) => void;
  clearMessages: () => void;
  loadConversation: (id: string, messages: ChatMessage[]) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  conversationId: generateId(),
  isStreaming: false,
  streamingContent: "",

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  updateStreamingContent: (content) =>
    set({ streamingContent: content }),

  appendStreamingContent: (chunk) =>
    set((state) => ({
      streamingContent: state.streamingContent + chunk,
    })),

  finalizeStreaming: () => {
    const { streamingContent, messages } = get();
    if (streamingContent.trim()) {
      set({
        messages: [
          ...messages,
          {
            id: generateId(),
            role: "assistant",
            content: streamingContent,
            createdAt: new Date(),
          },
        ],
        streamingContent: "",
        isStreaming: false,
      });
    }
  },

  setIsStreaming: (streaming) => set({ isStreaming: streaming }),

  setConversationId: (id) => set({ conversationId: id }),

  clearMessages: () =>
    set({
      messages: [],
      conversationId: generateId(),
      streamingContent: "",
      isStreaming: false,
    }),

  loadConversation: (id: string, messages: ChatMessage[]) =>
    set({
      conversationId: id,
      messages,
      streamingContent: "",
      isStreaming: false,
    }),
}));
