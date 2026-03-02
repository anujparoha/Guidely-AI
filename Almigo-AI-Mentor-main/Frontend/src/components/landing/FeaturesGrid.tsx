import { motion } from "framer-motion";
import {
  MessageSquare,
  Map,
  FileText,
  Users,
  Zap,
  Brain,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const FEATURES: Feature[] = [
  {
    icon: MessageSquare,
    title: "AI Mentor Chat",
    description:
      "Have real-time conversations with an AI mentor that understands your context and gives actionable guidance.",
    gradient: "from-teal-500 to-cyan-400",
  },
  {
    icon: Map,
    title: "Smart Roadmaps",
    description:
      "Get personalized learning roadmaps based on your goals, current skills, and preferred timeline.",
    gradient: "from-cyan-400 to-emerald-400",
  },
  {
    icon: FileText,
    title: "Session Summaries",
    description:
      "Automatically summarize your learning sessions with key takeaways and action items.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Users,
    title: "Mentor Search",
    description:
      "Find the perfect mentor match using semantic search powered by AI embeddings.",
    gradient: "from-amber-400 to-orange-400",
  },
  {
    icon: Zap,
    title: "Real-time Streaming",
    description:
      "Watch responses stream in real-time — no waiting. Instant, flowing AI guidance as you type.",
    gradient: "from-teal-400 to-cyan-300",
  },
  {
    icon: Brain,
    title: "Personalized Learning",
    description:
      "AI adapts to your skill level, learning pace, and goals for truly personalized mentorship.",
    gradient: "from-cyan-500 to-teal-400",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block text-xs font-semibold text-teal-600 dark:text-teal-400 tracking-widest uppercase mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
              Level Up
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-gray-400">
            Powerful AI tools designed to accelerate your learning and career growth.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-sm hover:border-teal-300/60 dark:hover:border-teal-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/5 dark:hover:shadow-teal-500/10"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/5 to-cyan-400/5 dark:from-teal-500/10 dark:to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-md mb-4`}
                >
                  <feature.icon className="w-5 h-5" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
