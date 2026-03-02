import { useState, useEffect, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface HistoryPanelProps<T> {
  /** Function to fetch history data */
  fetchFn: () => Promise<T[]>;
  /** Render each history item card */
  renderItem: (item: T, index: number) => ReactNode;
  /** Called when user clicks a history card */
  onSelect: (item: T) => void;
  /** Key extractor */
  getKey: (item: T) => string;
  /** Optional label */
  label?: string;
}

export function HistoryPanel<T>({
  fetchFn,
  renderItem,
  onSelect,
  getKey,
  label = "Recent",
}: HistoryPanelProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchFn();
      setItems(data);
    } catch {
      // silently fail
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  }, [fetchFn]);

  // Fetch on first open
  useEffect(() => {
    if (isOpen && !hasFetched) {
      fetchData();
    }
  }, [isOpen, hasFetched, fetchData]);

  return (
    <div>
      {/* Toggle button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 text-xs rounded-full"
      >
        <Clock className="w-3.5 h-3.5" />
        {label}
        <span className="text-[10px] text-muted-foreground">
          ({items.length}/5)
        </span>
      </Button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-2">
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-3">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-6 px-4">
                  <Inbox className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No history yet
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <motion.div
                      key={getKey(item)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className="p-3 cursor-pointer hover:bg-muted/50 transition-colors duration-150"
                        onClick={() => onSelect(item)}
                      >
                        {renderItem(item, index)}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Cap indicator */}
              {items.length > 0 && (
                <p className="text-[10px] text-muted-foreground text-center pt-1">
                  Showing last {items.length} of 5 max
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
