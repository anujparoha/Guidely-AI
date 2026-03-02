import { motion } from "framer-motion";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Search, Users, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { HistoryPanel } from "@/components/ui/HistoryPanel";
import { useMentorSearch } from "@/hooks/useMentorSearch";
import { getSearchHistory } from "@/services/history";
import type { MentorSearchResult, SearchHistoryEntry } from "@/types";

export default function SearchPage() {
  useDocumentTitle("Find Mentors");
  const { query, setQuery, results, isLoading, error } = useMentorSearch();

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white">
            <Users className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-bold">Find a Mentor</h1>
        </div>
        <p className="text-muted-foreground">
          Search for mentors by skills, expertise, or career interests using
          semantic search.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mentors... e.g., 'machine learning expert' or 'frontend architect'"
          className="pl-11 h-12 text-base rounded-xl"
          autoFocus
        />
      </div>

      {/* History Panel */}
      <HistoryPanel<SearchHistoryEntry>
        fetchFn={getSearchHistory}
        getKey={(item) => item.id}
        onSelect={(item) => setQuery(item.query)}
        label="Past Searches"
        renderItem={(item) => (
          <div className="space-y-1">
            <p className="text-sm font-medium truncate">{item.query}</p>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>Top {item.topK} results</span>
              <span>·</span>
              <span>{item.resultIds.length} found</span>
              <span>·</span>
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      />

      {/* Error */}
      {error && (
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">
              Search failed. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isLoading && <SearchSkeleton />}

      {/* Results */}
      {!isLoading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result, index) => (
            <MentorCard key={result.mentor.id} result={result} index={index} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && query.trim() && results.length === 0 && !error && (
        <EmptyState
          icon={<Search className="w-8 h-8 text-muted-foreground" />}
          title="No mentors found"
          description="Try different keywords or broader search terms to find relevant mentors."
        />
      )}

      {/* Initial state */}
      {!query.trim() && !isLoading && results.length === 0 && (
        <div className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold mb-1">
              Discover Your Perfect Mentor
            </h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Start typing to search for mentors based on skills, expertise, or
              career interests. Our AI-powered search finds the best matches.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}



function MentorCard({
  result,
  index,
}: {
  result: MentorSearchResult;
  index: number;
}) {
  const { mentor, similarityScore } = result;
  const scorePercent = Math.round(similarityScore * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                {mentor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <CardTitle className="text-base">{mentor.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{mentor.email}</p>
              </div>
            </div>
            <Badge
              variant={scorePercent >= 80 ? "default" : "secondary"}
              className="shrink-0"
            >
              <Star className="w-3 h-3 mr-1" />
              {scorePercent}% match
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {mentor.bio}
          </p>

          {/* Skills */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {mentor.skills.slice(0, 6).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {mentor.skills.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{mentor.skills.length - 6}
                </Badge>
              )}
            </div>
          </div>

          {/* Expertise */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
              Expertise
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {mentor.expertise.slice(0, 4).map((exp) => (
                <Badge
                  key={exp}
                  className="text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
                >
                  {exp}
                </Badge>
              ))}
              {mentor.expertise.length > 4 && (
                <Badge className="text-xs bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20">
                  +{mentor.expertise.length - 4}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}



function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-1.5">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
