import { useState, useCallback } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { X, Plus, Map, Clock, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { HistoryPanel } from "@/components/ui/HistoryPanel";
import { useRoadmap } from "@/hooks/useRoadmap";
import { getRoadmaps } from "@/services/history";
import type { RoadmapOutput, SavedRoadmapHistory } from "@/types";

const TIMELINE_OPTIONS = [
  "1 month",
  "3 months",
  "6 months",
  "1 year",
  "2 years",
];

export default function RoadmapPage() {
  useDocumentTitle("Learning Roadmap Generator");
  const [goal, setGoal] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [timeline, setTimeline] = useState("3 months");

  const { mutate, data: mutationData, isPending, error, reset } = useRoadmap();
  const [loadedRoadmap, setLoadedRoadmap] = useState<RoadmapOutput | null>(null);

  const data = loadedRoadmap || mutationData;

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleGenerate = () => {
    if (goal.trim() && skills.length > 0) {
      mutate({ goal, currentSkills: skills, timeline });
    }
  };

  const handleReset = () => {
    setGoal("");
    setSkills([]);
    setSkillInput("");
    setTimeline("3 months");
    setLoadedRoadmap(null);
    reset();
  };

  const handleHistorySelect = useCallback((item: SavedRoadmapHistory) => {
    setGoal(item.goal);
    setSkills(item.currentSkills);
    setTimeline(item.timeline);
    setLoadedRoadmap(item.result);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
            <Map className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-bold">Learning Roadmap</h1>
        </div>
        <p className="text-muted-foreground">
          Generate a personalized learning roadmap based on your goals and
          current skills.
        </p>
      </div>

      {/* History Panel */}
      <HistoryPanel<SavedRoadmapHistory>
        fetchFn={getRoadmaps}
        getKey={(item) => item.id}
        onSelect={handleHistorySelect}
        label="Past Roadmaps"
        renderItem={(item) => (
          <div className="space-y-1.5">
            <p className="text-sm font-medium truncate">{item.goal}</p>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span>{item.timeline}</span>
              <span>·</span>
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.currentSkills.slice(0, 3).map((s) => (
                <Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0">
                  {s}
                </Badge>
              ))}
              {item.currentSkills.length > 3 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  +{item.currentSkills.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      />

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Learning Profile</CardTitle>
          <CardDescription>
            Tell us about your goals so we can create the perfect roadmap.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Goal */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-500" />
              Learning Goal
            </label>
            <Input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Become a full-stack developer"
              className="h-11"
            />
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Current Skills
            </label>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter"
                className="h-11"
              />
              <Button
                onClick={addSkill}
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="pl-2.5 pr-1 py-1 gap-1"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="hover:bg-muted rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-500" />
              Timeline
            </label>
            <div className="flex flex-wrap gap-2">
              {TIMELINE_OPTIONS.map((option) => (
                <Button
                  key={option}
                  variant={timeline === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeline(option)}
                  className="rounded-full"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleGenerate}
              disabled={!goal.trim() || skills.length === 0 || isPending}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Roadmap
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
              Failed to generate roadmap. Please try again.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading Skeleton */}
      {isPending && <RoadmapSkeleton />}

      {/* Roadmap Result */}
      {data && !isPending && <RoadmapDisplay roadmap={data} />}
    </div>
  );
}



function RoadmapDisplay({ roadmap }: { roadmap: RoadmapOutput }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{roadmap.title}</CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Estimated duration: {roadmap.duration}
          </CardDescription>
        </CardHeader>
      </Card>

      {roadmap.phases.map((phase, index) => (
        <PhaseCard key={index} phase={phase} index={index} />
      ))}
    </motion.div>
  );
}

function PhaseCard({
  phase,
  index,
}: {
  phase: { phase: string; topics: string[]; resources: string[] };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Collapsible defaultOpen>
        <Card className="overflow-hidden">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {index + 1}
                </div>
                <CardTitle className="text-base text-left">
                  {phase.phase}
                </CardTitle>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                  Topics
                </h4>
                <ul className="space-y-1.5">
                  {phase.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                  Resources
                </h4>
                <ul className="space-y-1.5">
                  {phase.resources.map((resource, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </motion.div>
  );
}



function RoadmapSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-40 mt-2" />
        </CardHeader>
      </Card>
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-5 w-48" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
