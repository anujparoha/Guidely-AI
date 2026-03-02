import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const ORB_ILLUSTRATIONS = [
  { src: "/images/hero/orb-chat.png", alt: "AI Mentor helping with code" },
  { src: "/images/hero/orb-roadmap.png", alt: "AI Mentor guiding a roadmap" },
  { src: "/images/hero/orb-grow.png", alt: "Celebrating learning milestones" },
] as const;

export function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % ORB_ILLUSTRATIONS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollToFeatures = () => {
    document.querySelector("#features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-teal-200/40 to-cyan-200/30 blur-3xl dark:from-teal-500/15 dark:to-cyan-500/10" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-emerald-200/30 to-teal-200/20 blur-3xl dark:from-emerald-500/10 dark:to-teal-500/5" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-r from-cyan-200/20 to-teal-200/20 blur-3xl dark:from-cyan-500/5 dark:to-teal-500/5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy */}
          <div className="max-w-2xl">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100/60 dark:bg-teal-500/10 border border-teal-200/60 dark:border-teal-500/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 tracking-wide uppercase">
                AI-Powered Mentorship
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
            >
              Your AI Mentor.
              <br />
              <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
                Zero Gatekeeping.
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-gray-400 leading-relaxed max-w-lg"
            >
              Get personalized AI guidance, smart roadmaps, and real-time
              answers — like having a senior dev mentor available 24/7.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 shadow-xl shadow-teal-500/25 dark:shadow-teal-500/30 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Try AI Mentor
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button
                onClick={scrollToFeatures}
                className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-slate-700 dark:text-gray-300 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-all"
              >
                <Play className="w-4 h-4 text-teal-500" />
                View Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="mt-12 flex gap-8 sm:gap-12"
            >
              {[
                { value: "10K+", label: "Active Users" },
                { value: "50K+", label: "Sessions" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-gray-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Animated Orb with AI Characters */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <div className="relative w-[440px] h-[440px]">
              {/* Outer glow ring — pulses softly */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500/20 to-cyan-400/20 dark:from-teal-500/30 dark:to-cyan-400/30 blur-2xl animate-pulse" />

              {/* Outer gradient ring */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-teal-400 via-cyan-400 to-emerald-400 opacity-60 dark:opacity-40 blur-xl" />

              {/* Main orb background */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 shadow-2xl shadow-teal-500/30" />

              {/* Inner glass overlay */}
              <div className="absolute inset-10 rounded-full bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10 overflow-hidden">
                {/* Cycling AI character illustrations */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeSlide}
                    src={ORB_ILLUSTRATIONS[activeSlide].src}
                    alt={ORB_ILLUSTRATIONS[activeSlide].alt}
                    initial={{ opacity: 0, scale: 1.1, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    transition={{ duration: 0.8, ease: "easeInOut" as const }}
                    className="absolute inset-0 w-full h-full object-cover rounded-full"
                  />
                </AnimatePresence>
              </div>

              {/* Rotating ring decoration */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 rounded-full border border-dashed border-teal-300/30 dark:border-teal-400/20"
              />

              {/* Slide indicator dots */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {ORB_ILLUSTRATIONS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === activeSlide
                        ? "w-6 h-2 bg-teal-500 shadow-md shadow-teal-500/50"
                        : "w-2 h-2 bg-slate-300 dark:bg-gray-600 hover:bg-teal-400/50"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Floating particles */}
              <div className="absolute top-10 right-10 w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50 animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }} />
              <div className="absolute bottom-14 left-6 w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-bounce" style={{ animationDelay: "1s", animationDuration: "4s" }} />
              <div className="absolute top-1/2 right-2 w-2.5 h-2.5 rounded-full bg-cyan-300 shadow-lg shadow-cyan-300/50 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "3.5s" }} />

              {/* Floating info cards */}
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-4 px-4 py-3 rounded-xl bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-xl shadow-slate-900/5 dark:shadow-black/20"
              >
                <div className="text-xs font-semibold text-slate-700 dark:text-gray-300">AI Roadmap</div>
                <div className="text-[10px] text-slate-500 dark:text-gray-500 mt-0.5">Generated in 2s</div>
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -left-6 px-4 py-3 rounded-xl bg-white/90 dark:bg-white/10 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 shadow-xl shadow-slate-900/5 dark:shadow-black/20"
              >
                <div className="text-xs font-semibold text-teal-600 dark:text-teal-400">✓ Session Saved</div>
                <div className="text-[10px] text-slate-500 dark:text-gray-500 mt-0.5">3 key takeaways</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
