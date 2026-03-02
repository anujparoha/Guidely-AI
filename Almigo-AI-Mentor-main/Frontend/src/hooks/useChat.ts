import { useCallback, useRef } from "react";
import { fetchSSE } from "@/services/api";
import { useChatStore } from "@/store/chatStore";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useChat() {
  const {
    messages,
    conversationId,
    isStreaming,
    streamingContent,
    addMessage,
    appendStreamingContent,
    updateStreamingContent,
    finalizeStreaming,
    setIsStreaming,
    clearMessages,
  } = useChatStore();

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return;


      addMessage({
        id: generateId(),
        role: "user",
        content: content.trim(),
        createdAt: new Date(),
      });


      setIsStreaming(true);
      updateStreamingContent("");

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        await fetchSSE(
          "/chat",
          { conversationId, message: content.trim() },
          (data) => {
            if (data.done) {
              finalizeStreaming();
            } else if (data.content) {
              appendStreamingContent(data.content);
            }
          },
          controller.signal
        );
      } catch (error) {
        if ((error as Error).name !== "AbortError") {

          const store = useChatStore.getState();
          if (store.streamingContent.trim()) {
            finalizeStreaming();
          } else {
            addMessage({
              id: generateId(),
              role: "assistant",
              content:
                "I'm sorry, I encountered an error. Please try again.",
              createdAt: new Date(),
            });
          }
          setIsStreaming(false);
        }
      }
    },
    [
      conversationId,
      isStreaming,
      addMessage,
      appendStreamingContent,
      updateStreamingContent,
      finalizeStreaming,
      setIsStreaming,
    ]
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    finalizeStreaming();
    setIsStreaming(false);
  }, [finalizeStreaming, setIsStreaming]);

  const retryLastMessage = useCallback(() => {
    const userMessages = messages.filter((m) => m.role === "user");
    const lastUserMessage = userMessages[userMessages.length - 1];
    if (lastUserMessage) {
      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  return {
    messages,
    isStreaming,
    streamingContent,
    sendMessage,
    stopStreaming,
    retryLastMessage,
    clearMessages,
  };
}
