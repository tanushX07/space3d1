import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Orbit, ChevronDown, Radio } from "lucide-react";
import { CHAPTERS } from "../data/planets";

interface Props {
  progress: number;
  activeIndex: number;
  velocity: number;
  onNavigate: (id: string) => void;
}

function useMissionClock() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setT(Date.now() - start), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.floor(t / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `T+${hh}:${mm}:${ss}`;
}

export default function Navbar({ progress, activeIndex, velocity, onNavigate }: Props) {
  const clock = useMissionClock();
  const [scrolled, setScrolled] = useState(false);
  const active = CHAPTERS[Math.min(activeIndex, CHAPTERS.length - 1)];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* main bar */}
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "border-b border-white/[0.06] bg-[#020108]/72 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between px-5 md:px-10">
          {/* logo */}
          <button onClick={() => onNavigate("void")} className="group flex items-center gap-3 text-left">
            <span className="relative flex h-10 w-10 items-center justify-center">
              <span className="absolute inset-0 animate-spin rounded-full border border-cyan-300/30 [animation-duration:9s]" />
              <span className="absolute inset-[5px] animate-spin rounded-full border border-dashed border-violet-400/40 [animation-duration:14s] [animation-direction:reverse]" />
              <Orbit className="h-4 w-4 text-cyan-300 transition-transform duration-500 group-hover:rotate-90" />
            </span>
            <span>
              <span className="font-display block text-[15px] font-bold leading-none tracking-[0.18em] text-white">
                ODYSSEY
              </span>
              <span className="mt-1 block font-mono text-[8.5px] tracking-[0.42em] text-cyan-300/70">
                DEEP SPACE PROGRAM
              </span>
            </span>
          </button>

          {/* center — live flow-state readout */}
          <div className="hidden items-center gap-4 lg:flex">
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[9px] tracking-[0.3em] text-white/50">
              <Radio className="h-3 w-3 animate-pulse text-emerald-300" />
              {clock}
            </span>
            <div className="h-8 w-px bg-white/10" />
            <div className="min-w-[240px] text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.35 }}
                >
                  <p className="font-mono text-[9px] tracking-[0.45em] text-violet-300/80">
                    {String(activeIndex).padStart(2, "0")} / {String(CHAPTERS.length - 1).padStart(2, "0")} — {active.sub.toUpperCase()}
                  </p>
                  <p className="font-display mt-1 text-sm font-semibold tracking-[0.3em] text-white">
                    {active.label}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <span className="flex min-w-[128px] items-center justify-end gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-white/50">
              VEL
              <span className="text-cyan-300">{velocity.toFixed(1)} LY/S</span>
            </span>
          </div>

          {/* right */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("galaxy")}
              className="group hidden items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/[0.06] px-5 py-2.5 font-mono text-[10px] tracking-[0.3em] text-cyan-100 transition-all duration-300 hover:border-cyan-300/60 hover:bg-cyan-300/[0.14] hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] sm:flex"
            >
              ENTER VOYAGE
              <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
            <div className="flex items-center gap-2 lg:hidden">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-white/70">
                {String(activeIndex).padStart(2, "0")}/{String(CHAPTERS.length - 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ THE FLOW LINE — header spine synced to scroll ══ */}
      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="relative h-[26px]">
          {/* track */}
          <div className="absolute left-0 right-0 top-[7px] h-px bg-white/[0.08]" />
          {/* progress fill */}
          <div
            className="absolute left-0 top-[7px] h-px bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-300 transition-[width] duration-150 ease-out"
            style={{ width: `${progress * 100}%`, boxShadow: "0 0 12px rgba(34,211,238,0.8)" }}
          />
          {/* voyager head */}
          <div
            className="absolute top-[7px] transition-[left] duration-150 ease-out"
            style={{ left: `calc(${progress * 100}% - 4px)` }}
          >
            <span className="block h-[9px] w-[9px] -translate-y-[4px] rotate-45 border border-cyan-200 bg-[#020108] shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
          </div>
          {/* chapter nodes */}
          {CHAPTERS.map((c, i) => {
            const left = (i / (CHAPTERS.length - 1)) * 100;
            const isActive = i === activeIndex;
            const isPassed = i < activeIndex;
            return (
              <button
                key={c.id}
                onClick={() => onNavigate(c.id)}
                className="group absolute top-[7px] -translate-x-1/2 p-2"
                style={{ left: `${left}%` }}
                aria-label={c.label}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-[9px] w-[9px] -translate-y-[4px] bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,1)]"
                      : isPassed
                        ? "h-[5px] w-[5px] -translate-y-[2px] bg-violet-400/90"
                        : "h-[5px] w-[5px] -translate-y-[2px] bg-white/20 group-hover:bg-white/60"
                  }`}
                />
                <span
                  className={`pointer-events-none absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap font-mono text-[8px] tracking-[0.3em] transition-all duration-300 ${
                    isActive ? "text-cyan-200 opacity-100" : "text-white/40 opacity-0 group-hover:opacity-100"
                  } hidden md:block`}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
