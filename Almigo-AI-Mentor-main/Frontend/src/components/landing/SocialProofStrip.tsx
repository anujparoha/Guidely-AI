import { motion } from "framer-motion";
import {
  Code2,
  Cpu,
  Globe,
  Laptop,
  Layers,
  Server,
  Smartphone,
  Terminal,
} from "lucide-react";

const BRANDS = [
  { icon: Code2, name: "DevStudio" },
  { icon: Terminal, name: "CodeCraft" },
  { icon: Cpu, name: "NeuralTech" },
  { icon: Globe, name: "WebForge" },
  { icon: Layers, name: "StackLabs" },
  { icon: Server, name: "CloudBase" },
  { icon: Laptop, name: "ByteWorks" },
  { icon: Smartphone, name: "AppPulse" },
] as const;

export function SocialProofStrip() {
  return (
    <section className="py-12 sm:py-16 border-y border-slate-200/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-slate-500 dark:text-gray-500 mb-8"
        >
          Trusted by{" "}
          <span className="text-teal-600 dark:text-teal-400 font-semibold">
            10,000+
          </span>{" "}
          developers and students worldwide
        </motion.p>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-marquee">
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex items-center gap-2.5 px-8 shrink-0"
            >
              <brand.icon className="w-5 h-5 text-slate-400 dark:text-gray-600" />
              <span className="text-sm font-semibold text-slate-400 dark:text-gray-600 whitespace-nowrap">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
