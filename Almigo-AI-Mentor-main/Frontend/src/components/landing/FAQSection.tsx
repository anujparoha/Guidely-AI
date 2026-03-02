import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What is Almigo and how does it work?",
    answer:
      "Almigo is an AI-powered mentorship platform. You can chat with an AI mentor that provides personalized guidance, generate learning roadmaps, summarize study sessions, and find mentors — all powered by state-of-the-art language models.",
  },
  {
    question: "Is Almigo free to use?",
    answer:
      "Almigo offers a generous free tier so you can experience the core features. Premium plans unlock unlimited sessions, priority responses, and advanced features like detailed roadmaps and session analytics.",
  },
  {
    question: "How is this different from ChatGPT?",
    answer:
      "Unlike generic chatbots, Almigo is purpose-built for mentorship and learning. It generates structured roadmaps, tracks your sessions, provides summaries with action items, and connects you with real mentors — all within a cohesive learning workflow.",
  },
  {
    question: "Is my data safe and private?",
    answer:
      "Absolutely. Your conversations and learning data are encrypted and never shared. We follow industry-standard security practices and you can delete your data at any time.",
  },
  {
    question: "Can I use Almigo for any programming language or topic?",
    answer:
      "Yes! Almigo's AI mentor can help with any programming language, framework, or tech topic. It also helps with career advice, interview prep, and soft skills — anything related to your growth as a developer.",
  },
  {
    question: "What if I'm a complete beginner?",
    answer:
      "Almigo is designed for all skill levels. The AI adapts its explanations to your experience level. Whether you're writing your first line of code or architecting distributed systems, Almigo meets you where you are.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 sm:py-28 bg-slate-50/50 dark:bg-white/[0.02]"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold text-teal-600 dark:text-teal-400 tracking-widest uppercase mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Got Questions?
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-gray-400">
            We've got answers.
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="rounded-xl border border-slate-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm overflow-hidden"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-sm font-semibold text-slate-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-slate-400 dark:text-gray-500 shrink-0 transition-transform duration-200",
                    openIndex === i && "rotate-180"
                  )}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
