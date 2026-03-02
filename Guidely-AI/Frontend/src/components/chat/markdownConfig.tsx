import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/CopyButton";

/**
 * Shared markdown component overrides for AI responses.
 * Used by both MessageBubble and StreamingBubble.
 */
export const markdownComponents: Partial<Components> = {
  h1: ({ children }) => (
    <h1 className="text-xl font-bold mt-6 mb-3 pb-2 border-b first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-lg font-bold mt-5 mb-2.5 first:mt-0">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold mt-4 mb-2 first:mt-0">
      {children}
    </h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-sm font-semibold mt-3 mb-1.5 first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mb-3 last:mb-0 leading-7">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 last:mb-0 space-y-1.5 list-disc list-outside pl-5 marker:text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 last:mb-0 space-y-1.5 list-decimal list-outside pl-5 marker:text-muted-foreground marker:font-semibold">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-7 pl-1">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-3 border-primary/40 bg-muted/40 rounded-r-lg px-4 py-2.5 mb-3 last:mb-0 italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-3 last:mb-0 rounded-lg border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted/60">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 text-left font-semibold text-xs uppercase tracking-wide border-b">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border-b border-border/50">{children}</td>
  ),
  hr: () => <hr className="my-4 border-border/60" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  pre: ({ children }) => {
    // Extract language + raw text from code child
    const codeChild = children as React.ReactElement<{
      className?: string;
      children?: string;
    }>;
    const className = codeChild?.props?.className || "";
    const langMatch = className.match(/language-(\w+)/);
    const lang = langMatch ? langMatch[1] : "";
    const rawText =
      typeof codeChild?.props?.children === "string"
        ? codeChild.props.children
        : "";

    return (
      <div className="relative group mb-3 last:mb-0 rounded-xl overflow-hidden border bg-secondary/80">
        {/* Language label + copy */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-muted/60 border-b text-xs text-muted-foreground">
          <span className="font-mono font-medium uppercase tracking-wider">
            {lang || "code"}
          </span>
          {rawText && <CopyButton text={rawText} />}
        </div>
        <pre className="p-4 overflow-x-auto text-[13px] leading-6">
          {children}
        </pre>
      </div>
    );
  },
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    return isInline ? (
      <code
        className="bg-muted/80 border border-border/40 px-1.5 py-0.5 rounded-md text-[13px] font-mono text-foreground"
        {...props}
      >
        {children}
      </code>
    ) : (
      <code className={cn(className, "text-[13px] font-mono leading-6")} {...props}>
        {children}
      </code>
    );
  },
};
