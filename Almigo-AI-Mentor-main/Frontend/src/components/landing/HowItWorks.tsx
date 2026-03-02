import { motion } from "framer-motion";
import { HelpCircle, Sparkles, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: "01",
    icon: HelpCircle,
    title: "Ask Anything",
    description:
      "Type your question, paste code, or describe the concept you're stuck on. No question is too basic or too advanced.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Get AI Guidance",
    description:
      "Receive personalized, context-aware answers from your AI mentor — with roadmaps, summaries, and actionable advice.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Grow Faster",
    description:
      "Track your progress, revisit sessions, and level up your skills 10x faster than traditional learning methods.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-slate-50/50 dark:bg-white/[0.02]">
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
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Three Steps to{" "}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
              10x Growth
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-gray-400">
            From question to mastery — it's that simple.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative grid md:grid-cols-3 gap-8 md:gap-6"
        >
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-16 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-teal-300/50 via-cyan-300/50 to-emerald-300/50 dark:from-teal-500/30 dark:via-cyan-500/30 dark:to-emerald-500/30" />

          {STEPS.map((step) => (
            <motion.div
              key={step.number}
              variants={item}
              className="relative flex flex-col items-center text-center"
            >
              {/* Number badge */}
              <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-teal-500/20 dark:shadow-teal-500/30 mb-6">
                <step.icon className="w-6 h-6" />
              </div>

              {/* Step number */}
              <span className="text-xs font-bold text-teal-500 dark:text-teal-400 tracking-widest mb-2">
                STEP {step.number}
              </span>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {step.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
