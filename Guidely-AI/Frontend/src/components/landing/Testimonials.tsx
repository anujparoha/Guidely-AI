import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  initial: string;
  gradient: string;
  quote: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Priya Sharma",
    role: "CS Student, IIT Delhi",
    initial: "P",
    gradient: "from-teal-500 to-cyan-400",
    quote:
      "Almigo helped me land my first internship! The roadmaps are incredibly detailed, and the AI actually understands where I'm stuck instead of giving generic answers.",
    rating: 5,
  },
  {
    name: "Alex Chen",
    role: "Full-Stack Developer",
    initial: "A",
    gradient: "from-emerald-500 to-teal-500",
    quote:
      "I switched from backend to full-stack in 3 months with Almigo's guidance. The session summaries keep me on track, and the mentor search is a game-changer.",
    rating: 5,
  },
  {
    name: "Sarah Williams",
    role: "Career Switcher",
    initial: "S",
    gradient: "from-cyan-400 to-teal-400",
    quote:
      "Coming from finance into tech was terrifying. Almigo's AI mentor broke down complex topics into digestible steps. It's like having a patient tutor 24/7.",
    rating: 5,
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function Testimonials() {
  return (
    <section className="py-20 sm:py-28">
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
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved by{" "}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-400 bg-clip-text text-transparent">
              Learners
            </span>{" "}
            Everywhere
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-gray-400">
            Don't take our word for it — hear from people who leveled up with Almigo.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-3 gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              className="p-6 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 backdrop-blur-sm"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed mb-6">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-sm font-bold shadow-md`}
                >
                  {t.initial}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-gray-500">
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
