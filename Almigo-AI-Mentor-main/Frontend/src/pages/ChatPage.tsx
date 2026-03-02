import { useRef, useEffect } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { StreamingBubble } from "@/components/chat/StreamingBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatHistorySidebar } from "@/components/chat/ChatHistorySidebar";
import { useChat } from "@/hooks/useChat";

export default function ChatPage() {
  useDocumentTitle("AI Career Chat");
  const {
    messages,
    isStreaming,
    streamingContent,
    sendMessage,
    stopStreaming,
    retryLastMessage,
    clearMessages,
  } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const hasMessages = messages.length > 0;
  const lastMessage = messages[messages.length - 1];
  const showRetry =
    !isStreaming &&
    lastMessage?.role === "assistant" &&
    lastMessage.content.includes("error");

  return (
    <div className="flex h-full relative">
      {/* Collapsible history sidebar */}
      <ChatHistorySidebar />

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <div className="border-b px-4 py-3 flex items-center justify-between bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 pl-10 lg:pl-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">Almigo Chat</h1>
              <p className="text-xs text-muted-foreground">
                Your personal career mentor
              </p>
            </div>
          </div>
          {hasMessages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearMessages}
              className="text-muted-foreground"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Clear
            </Button>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {!hasMessages && !isStreaming ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-lg"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome to Almigo
                </h2>
                <p className="text-muted-foreground mb-8">
                  Ask me anything about career development, learning paths,
                  technical skills, or professional growth. I'm here to help!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "How do I transition to backend engineering?",
                    "What skills should I learn for AI/ML?",
                    "Review my career growth plan",
                    "Help me prepare for system design interviews",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => sendMessage(suggestion)}
                      className="text-left text-sm p-3 rounded-xl border bg-card hover:bg-accent transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <AnimatePresence mode="popLayout">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MessageBubble message={msg} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Streaming */}
              {isStreaming && streamingContent && (
                <StreamingBubble content={streamingContent} />
              )}

              {/* Typing indicator */}
              {isStreaming && !streamingContent && <TypingIndicator />}

              {/* Retry */}
              {showRetry && (
                <div className="flex justify-center py-4">
                  <Button variant="outline" size="sm" onClick={retryLastMessage}>
                    <RotateCcw className="w-4 h-4 mr-1.5" />
                    Retry
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          onStop={stopStreaming}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
