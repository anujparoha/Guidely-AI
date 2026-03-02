import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  ChevronLeft,
  Plus,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { getConversations, getConversationById } from "@/services/history";
import type { ConversationHistory, ChatMessage } from "@/types";

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function ChatHistorySidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversations, setConversations] = useState<ConversationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const { conversationId, clearMessages, loadConversation } = useChatStore();

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getConversations();
      setConversations(data);
    } catch {
      // silently fail — sidebar is optional
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on first open
  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, fetchHistory]);

  async function handleSelectConversation(id: string) {
    if (id === conversationId) return;
    setLoadingId(id);
    try {
      const convo = await getConversationById(id);
      const messages: ChatMessage[] = convo.messages.map((m) => ({
        id: m.id,
        role: m.role === "USER" ? "user" : "assistant",
        content: m.content,
        createdAt: new Date(m.createdAt),
      }));
      loadConversation(convo.id, messages);
    } catch {
      // ignore
    } finally {
      setLoadingId(null);
    }
  }

  function handleNewChat() {
    clearMessages();
  }

  return (
    <>
      {/* Collapsed toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-2 top-3 z-10"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Chat history"
            >
              <History className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={cn(
              "h-full border-r bg-card flex flex-col overflow-hidden shrink-0 z-40",
              "max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:shadow-2xl"
            )}
          >
            {/* Header */}
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white">
                  <History className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-semibold">History</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 text-muted-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>

            {/* New Chat */}
            <div className="p-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewChat}
                className="w-full justify-start gap-2 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                New Chat
              </Button>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 px-3">
                  <MessageSquare className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No conversations yet
                  </p>
                </div>
              ) : (
                conversations.map((convo) => {
                  const isActive = convo.id === conversationId;
                  const lastMsg = convo.messages?.[0];
                  const preview = lastMsg
                    ? lastMsg.content.slice(0, 60) +
                      (lastMsg.content.length > 60 ? "…" : "")
                    : "No messages";

                  return (
                    <motion.button
                      key={convo.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleSelectConversation(convo.id)}
                      disabled={loadingId === convo.id}
                      className={cn(
                        "w-full text-left p-2.5 rounded-lg transition-all duration-150 group",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted/80"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare
                          className={cn(
                            "w-3.5 h-3.5 shrink-0",
                            isActive
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          )}
                        />
                        <span className="text-xs font-medium truncate flex-1">
                          {convo.title}
                        </span>
                        {loadingId === convo.id && (
                          <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-[10px] mt-1 line-clamp-1 pl-5.5",
                          isActive
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground"
                        )}
                      >
                        {preview}
                      </p>
                      <p
                        className={cn(
                          "text-[10px] mt-0.5 pl-5.5",
                          isActive
                            ? "text-primary-foreground/50"
                            : "text-muted-foreground/60"
                        )}
                      >
                        {timeAgo(convo.updatedAt)}
                      </p>
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t">
              <p className="text-[10px] text-muted-foreground text-center">
                Last 5 conversations
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
