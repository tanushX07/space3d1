import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "CALIBRATING STAR CHARTS",
  "SPOOLING WARP DRIVE",
  "MAPPING MILKY WAY GATE",
  "RENDERING 8 WORLDS",
  "TRAJECTORY LOCKED",
];

export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [line, setLine] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let v = 0;
    const tick = setInterval(() => {
      v += 2 + Math.random() * 7;
      if (v >= 100) {
        v = 100;
        clearInterval(tick);
        setTimeout(() => setLeaving(true), 420);
        setTimeout(onDone, 1350);
      }
      setProgress(Math.floor(v));
      setLine(Math.min(BOOT_LINES.length - 1, Math.floor((v / 100) * BOOT_LINES.length)));
    }, 90);
    return () => clearInterval(tick);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!leaving ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020108]"
          exit={{ y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* warp streaks */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 46 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent"
                style={{
                  width: `${120 + (i % 7) * 60}px`,
                  rotate: `${(i / 46) * 360}deg`,
                  transformOrigin: "0 0",
                }}
                initial={{ opacity: 0, scaleX: 0, x: 0 }}
                animate={{ opacity: [0, 0.9, 0], scaleX: [0, 1, 1.6], x: [0, 120, 520] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: (i % 12) * 0.12, ease: "easeOut" }}
              />
            ))}
          </div>

          {/* core */}
          <motion.div
            className="relative mb-10 flex h-24 w-24 items-center justify-center"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="absolute inset-0 animate-spin rounded-full border border-cyan-300/20 [animation-duration:6s]" />
            <div className="absolute inset-2 animate-spin rounded-full border border-dashed border-violet-400/30 [animation-duration:10s] [animation-direction:reverse]" />
            <motion.div
              className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-400 via-fuchsia-400 to-cyan-300"
              animate={{ boxShadow: ["0 0 30px #7c3aed", "0 0 70px #22d3ee", "0 0 30px #7c3aed"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <div className="relative z-10 text-center">
            <p className="font-mono text-[10px] tracking-[0.55em] text-cyan-300/80">INTERSTELLAR VOYAGE SYSTEM</p>
            <h1 className="font-display mt-3 text-5xl font-extrabold tracking-tight text-white md:text-6xl">
              ODYSSEY
            </h1>
            <div className="mx-auto mt-8 h-px w-64 overflow-hidden bg-white/10 md:w-80">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 flex w-64 items-center justify-between font-mono text-[10px] tracking-[0.25em] text-white/50 md:w-80">
              <AnimatePresence mode="wait">
                <motion.span
                  key={line}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                >
                  {BOOT_LINES[line]}
                </motion.span>
              </AnimatePresence>
              <span className="text-cyan-300">{String(progress).padStart(3, "0")}%</span>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="flash"
          className="fixed inset-0 z-[100] bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.9 }}
        />
      )}
    </AnimatePresence>
  );
}
