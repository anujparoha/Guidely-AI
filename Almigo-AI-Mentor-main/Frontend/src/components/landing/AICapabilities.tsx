import { motion } from "framer-motion";
import { Bot, Lightbulb, Gauge } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Capability {
  icon: LucideIcon;
  title: string;
  description: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: Bot,
    title: "GPT-Powered Mentoring",
    description:
      "Backed by state-of-the-art language models that understand code, concepts, and career questions at an expert level.",
  },
  {
    icon: Lightbulb,
    title: "Personalized Learning Paths",
    description:
      "AI creates custom roadmaps tailored to your experience level, goals, and preferred learning pace.",
  },
  {
    icon: Gauge,
    title: "Real-Time Answers",
    description:
      "No waiting for office hours. Get streaming, real-time responses to unblock your learning instantly.",
  },
];

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export function AICapabilities() {
  return (
    <section
      id="capabilities"
      className="relative py-20 sm:py-28 overflow-hidden"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-teal-50 via-cyan-50/50 to-white dark:from-teal-950/40 dark:via-slate-950 dark:to-slate-950 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-teal-300/20 to-cyan-300/20 dark:from-teal-500/10 dark:to-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block text-xs font-semibold text-teal-600 dark:text-teal-400 tracking-widest uppercase mb-4">
            AI Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Powered by{" "}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
              Next-Gen AI
            </span>
          </h2>
          <p className="mt-5 text-lg sm:text-xl text-slate-600 dark:text-gray-400 leading-relaxed">
            Not just another chatbot. Almigo combines cutting-edge AI with
            deep understanding of how people actually learn and grow.
          </p>
        </motion.div>

        {/* Capabilities */}
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              custom={i}
              variants={item}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative p-8 rounded-2xl bg-white/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-sm text-center group hover:border-teal-300/60 dark:hover:border-teal-500/30 transition-all duration-300"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/5 to-cyan-400/5 dark:from-teal-500/10 dark:to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 dark:shadow-teal-500/30 mb-5">
                  <cap.icon className="w-7 h-7" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  {cap.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
