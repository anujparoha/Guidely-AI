import { useState, useCallback } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clipboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CopyButton } from "@/components/ui/CopyButton";
import { HistoryPanel } from "@/components/ui/HistoryPanel";
import { useSummarize } from "@/hooks/useSummarize";
import { getSummaries } from "@/services/history";
import type { SessionSummaryOutput, SavedSummaryHistory } from "@/types";

export default function SummarizePage() {
  useDocumentTitle("Session Summarizer");
  const [transcript, setTranscript] = useState("");
  const { mutate, data: mutationData, isPending, error, reset } = useSummarize();
  const [loadedSummary, setLoadedSummary] = useState<SessionSummaryOutput | null>(null);

  const data = loadedSummary || mutationData;

  const handleSummarize = () => {
    if (transcript.trim().length >= 50) {
      mutate({ transcript });
    }
  };

  const handleReset = () => {
    setTranscript("");
    setLoadedSummary(null);
    reset();
  };

  const handleHistorySelect = useCallback((item: SavedSummaryHistory) => {
    setTranscript(item.transcript);
    setLoadedSummary(item.result);
  }, []);

  const charCount = transcript.length;
  const isValid = charCount >= 50;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white">
            <FileText className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-bold">Session Summarizer</h1>
        </div>
        <p className="text-muted-foreground">
          Paste your mentoring session transcript and get a structured summary
          with key takeaways and action items.
        </p>
      </div>

      {/* History Panel */}
      <HistoryPanel<SavedSummaryHistory>
        fetchFn={getSummaries}
        getKey={(item) => item.id}
        onSelect={handleHistorySelect}
        label="Past Summaries"
        renderItem={(item) => (
          <div className="space-y-1">
            <p className="text-sm font-medium line-clamp-1">
              {item.result.summary.slice(0, 80)}…
            </p>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>{item.result.keyTakeaways.length} takeaways</span>
              <span>·</span>
              <span>{item.result.actionItems.length} actions</span>
              <span>·</span>
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      />

      {/* Input */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Session Transcript</CardTitle>
          <CardDescription>
            Paste the full transcript of your mentoring session below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste your session transcript here... (minimum 50 characters)"
              className="min-h-[200px] resize-y text-base"
              maxLength={50000}
            />
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span
                className={
                  charCount > 0 && !isValid ? "text-destructive" : ""
                }
              >
                {charCount.toLocaleString()} / 50,000 characters
                {charCount > 0 && !isValid && " (minimum 50)"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={async () => {
                  const text = await navigator.clipboard.readText();
                  setTranscript(text);
                }}
              >
                <Clipboard className="w-3 h-3 mr-1" />
                Paste from clipboard
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSummarize}
              disabled={!isValid || isPending}
              className="bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 text-white"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Summarize Session
                </>
              )}
            </Button>
            {data && (
              <Button variant="outline" onClick={handleReset}>
                Start Over
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">
              Failed to summarize transcript. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isPending && <SummarySkeleton />}

      {/* Results */}
      <AnimatePresence>
        {data && !isPending && <SummaryDisplay summary={data} />}
      </AnimatePresence>
    </div>
  );
}



function SummaryDisplay({ summary }: { summary: SessionSummaryOutput }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-500" />
              Summary
            </CardTitle>
            <CopyButton text={summary.summary} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{summary.summary}</p>
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Key Takeaways
            </CardTitle>
            <CopyButton text={summary.keyTakeaways.join("\n")} />
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {summary.keyTakeaways.map((takeaway, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2.5 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {takeaway}
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-teal-500" />
              Action Items
            </CardTitle>
            <CopyButton text={summary.actionItems.join("\n")} />
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {summary.actionItems.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                className="flex items-start gap-2.5 text-sm"
              >
                <div className="w-5 h-5 rounded-full border-2 border-teal-500 flex items-center justify-center shrink-0 mt-0.5">
                   <span className="text-xs font-bold text-teal-500">
                    {i + 1}
                  </span>
                </div>
                {item}
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}



function SummarySkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6 mt-2" />
          <Skeleton className="h-4 w-4/6 mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
