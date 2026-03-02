import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Bot } from "lucide-react";
import { markdownComponents } from "@/components/chat/markdownConfig";

interface StreamingBubbleProps {
  content: string;
}

export function StreamingBubble({ content }: StreamingBubbleProps) {
  return (
    <div className="flex gap-3 px-4 py-6 bg-muted/50">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-gradient-to-br from-teal-500 to-cyan-400 text-white">
        <Bot className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <span className="text-sm font-semibold">Almigo</span>
        <div className="max-w-none text-[15px] leading-7">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={markdownComponents}
          >
            {content}
          </ReactMarkdown>
          <span className="inline-block w-2 h-5 bg-foreground/70 animate-pulse ml-0.5 align-text-bottom" />
        </div>
      </div>
    </div>
  );
}
