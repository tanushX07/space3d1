import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  Fingerprint,
  Globe2,
  Moon,
  Orbit,
  Radar,
  Ruler,
  Satellite,
  Sparkles,
  Sun,
  Thermometer,
  Timer,
  Weight,
} from "lucide-react";
import { PLANETS, type PlanetData } from "../data/planets";

/* ---------------- helpers ---------------- */

export function Reveal({
  children,
  delay = 0,
  y = 44,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SplitTitle({
  text,
  className = "",
  letterClass = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  letterClass?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  let ci = 0;
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {w.split("").map((ch, i) => {
            const d = delay + ci++ * 0.028;
            return (
              <motion.span
                key={i}
                className={`inline-block ${letterClass}`}
                initial={{ opacity: 0, y: 60, rotateX: -70, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] }}
              >
                {ch}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1800;
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref}>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function ChapterDivider({ chapter, index }: { chapter: string; index: string }) {
  return (
    <Reveal>
      <div className="flex items-center gap-4">
        <span className="font-mono text-[10px] tracking-[0.4em] text-cyan-300/90">{index}</span>
        <span className="h-px w-14 bg-gradient-to-r from-cyan-300/70 to-transparent" />
        <span className="font-mono text-[10px] tracking-[0.4em] text-white/60">{chapter}</span>
      </div>
    </Reveal>
  );
}

/* ---------------- HERO — THE VOID ---------------- */

export function Hero({ onNavigate }: { onNavigate: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yTitle = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <section id="void" ref={ref} className="relative flex min-h-[115vh] flex-col items-center justify-center overflow-hidden px-5">
      {/* HUD frame corners */}
      <div className="pointer-events-none absolute inset-x-5 top-28 hidden justify-between font-mono text-[9px] tracking-[0.35em] text-white/35 md:inset-x-10 md:flex">
        <span className="flex items-center gap-2"><Satellite className="h-3 w-3" /> DSN UPLINK · 34M ANTENNA</span>
        <span className="flex items-center gap-2"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" /> SIGNAL LOCK 99.7%</span>
      </div>

      <motion.div style={{ y: yTitle, opacity, scale }} className="relative z-10 mx-auto max-w-6xl text-center">
        <Reveal>
          <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
            </span>
            <span className="font-mono text-[10px] tracking-[0.45em] text-white/70">CHAPTER 00 — THE VOID</span>
          </div>
        </Reveal>

        <h1 className="font-display mt-8 leading-[0.95]">
          <SplitTitle text="BEYOND" delay={0.15} className="block text-[15vw] font-black tracking-tight md:text-[9rem]" letterClass="text-stroke" />
          <SplitTitle text="THE VOID" delay={0.4} className="block text-[15vw] font-black tracking-tight drop-shadow-[0_0_50px_rgba(124,58,237,0.45)] md:text-[9rem]" letterClass="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-cyan-200 bg-clip-text text-transparent" />
        </h1>

        <Reveal delay={0.7}>
          <p className="mx-auto mt-8 max-w-2xl text-balance text-base leading-relaxed text-white/65 md:text-lg">
            You begin in absolute nothingness — 13.8 billion years from the beginning of
            everything. Scroll, and fall inward: through the galactic gate, past eight
            worlds, toward the edge of the known.
          </p>
        </Reveal>

        <Reveal delay={0.85}>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={() => onNavigate("galaxy")}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-9 py-4 font-mono text-[11px] tracking-[0.35em] text-white transition-all duration-300 hover:shadow-[0_0_50px_rgba(124,58,237,0.6)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                BEGIN THE DESCENT <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </button>
            <button
              onClick={() => onNavigate("earth")}
              className="group flex items-center gap-3 rounded-full border border-white/15 px-9 py-4 font-mono text-[11px] tracking-[0.35em] text-white/75 backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:text-white"
            >
              <Globe2 className="h-4 w-4 text-cyan-300" /> SKIP TO EARTH
            </button>
          </div>
        </Reveal>

        {/* voyage stats */}
        <Reveal delay={1}>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md sm:grid-cols-4">
            {[
              { v: "08", l: "WORLDS TO VISIT" },
              { v: "4.6B", l: "YEARS OF HISTORY" },
              { v: "4.5B", l: "KM TRAVELLED" },
              { v: "∞", l: "WONDER GUARANTEED" },
            ].map((s) => (
              <div key={s.l} className="bg-[#060213]/85 px-4 py-5">
                <p className="font-display text-2xl font-bold text-white md:text-3xl">{s.v}</p>
                <p className="mt-1 font-mono text-[8.5px] tracking-[0.3em] text-white/45">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </motion.div>

      {/* scroll cue */}
      <motion.div style={{ opacity }} className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-7 items-start justify-center rounded-full border border-white/20 p-2">
            <motion.span
              className="h-2 w-1 rounded-full bg-cyan-300"
              animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="flex items-center gap-2 font-mono text-[9px] tracking-[0.4em] text-white/45">
            SCROLL TO ENGAGE THRUSTERS <ChevronsDown className="h-3 w-3 animate-bounce text-cyan-300" />
          </p>
        </div>
      </motion.div>

      {/* side telemetry */}
      <div className="pointer-events-none absolute bottom-10 left-5 hidden font-mono text-[9px] leading-relaxed tracking-[0.25em] text-white/30 md:left-10 lg:block">
        LAT +28.47 · LON −80.53
        <br />
        ALT 402 KM · ISS RELAY
      </div>
      <div className="pointer-events-none absolute bottom-10 right-5 hidden text-right font-mono text-[9px] leading-relaxed tracking-[0.25em] text-white/30 md:right-10 lg:block">
        RADIATION NOMINAL
        <br />
        HULL INTEGRITY 100%
      </div>
    </section>
  );
}

/* ---------------- GALAXY GATE ---------------- */

export function Galaxy() {
  return (
    <section id="galaxy" className="relative flex min-h-[135vh] items-center px-5 py-32 md:px-10">
      <div className="mx-auto grid w-full max-w-[1500px] gap-10 lg:grid-cols-2">
        <div className="flex flex-col justify-center rounded-3xl max-lg:border max-lg:border-white/10 max-lg:bg-[#020108]/60 max-lg:p-6 max-lg:backdrop-blur-md">
          <ChapterDivider chapter="MILKY WAY GATE" index="CHAPTER 01" />
          <h2 className="font-display mt-6 text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
            <SplitTitle text="ENTER THE" className="block" letterClass="text-white" />
            <SplitTitle text="GALAXY" delay={0.2} className="block" letterClass="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent" />
          </h2>
          <Reveal delay={0.25}>
            <p className="mt-7 max-w-xl leading-relaxed text-white/65 md:text-lg">
              A barred spiral 100,000 light-years wide — home to at least{" "}
              <span className="text-cyan-200">200 billion stars</span> and, hidden in
              one quiet arm, a single yellow dwarf with eight planets. You are falling
              toward it now. Feel the gravity take hold.
            </p>
          </Reveal>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
            {[
              { v: 200, s: "B+", l: "STARS", icon: Sparkles },
              { v: 100, s: "K LY", l: "DIAMETER", icon: Ruler },
              { v: 13.6, s: "B YR", l: "AGE", icon: Timer, d: 1 },
            ].map((s, i) => (
              <Reveal key={s.l} delay={0.3 + i * 0.1}>
                <div className="hud-corner glass rounded-xl p-4 text-center md:p-5">
                  <s.icon className="mx-auto h-4 w-4 text-violet-300" />
                  <p className="font-display mt-2 text-xl font-bold text-white md:text-3xl">
                    <Counter to={s.v} suffix={s.s} decimals={s.d ?? 0} />
                  </p>
                  <p className="mt-1 font-mono text-[8.5px] tracking-[0.3em] text-white/45">{s.l}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.5}>
            <div className="glass mt-6 flex max-w-xl items-start gap-4 rounded-2xl p-5">
              <Radar className="mt-1 h-5 w-5 shrink-0 animate-spin text-cyan-300 [animation-duration:5s]" />
              <p className="text-sm leading-relaxed text-white/60">
                <span className="font-mono text-[10px] tracking-[0.3em] text-cyan-200">NAV COMPUTER — </span>
                Eight planetary bodies detected ahead on approach vector. Terrestrial
                cluster first, then the gas and ice giants. Maintain scroll velocity.
              </p>
            </div>
          </Reveal>
        </div>
        {/* right side left open — the 3D galaxy core burns here */}
        <div className="relative hidden min-h-[500px] lg:block">
          <div className="absolute right-6 top-1/2 -translate-y-1/2 space-y-3 text-right font-mono text-[9px] tracking-[0.35em] text-white/35">
            <Reveal delay={0.3}><p>SAGITTARIUS A* — 4.3M M☉</p></Reveal>
            <Reveal delay={0.4}><p>ORION ARM — SOL APPROACH</p></Reveal>
            <Reveal delay={0.5}><p className="text-cyan-300/70">◉ YOU ARE HERE</p></Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- MARQUEE ---------------- */

export function Marquee() {
  const items = [...PLANETS, ...PLANETS];
  return (
    <div className="relative z-10 overflow-hidden border-y border-white/[0.07] bg-[#040110]/60 py-5 backdrop-blur-sm">
      <div className="mask-fade-x">
        <div className="flex w-max animate-[marquee_38s_linear_infinite] items-center gap-10 pr-10">
          {items.map((p, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap">
              <span className="font-display text-sm font-semibold tracking-[0.35em] text-white/55">{p.name}</span>
              <span className="h-1.5 w-1.5 rotate-45" style={{ background: p.accent }} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- PLANET CHAPTER ---------------- */

function Stat({ icon: Icon, label, value, accent }: { icon: typeof Sun; label: string; value: string; accent: string }) {
  return (
    <div className="group rounded-xl border border-white/[0.07] bg-white/[0.03] p-3.5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
        <p className="font-mono text-[8.5px] tracking-[0.28em] text-white/40">{label}</p>
      </div>
      <p className="font-display mt-1.5 text-[15px] font-semibold text-white">{value}</p>
    </div>
  );
}

export function PlanetSection({
  planet,
  position,
  prev,
  next,
  onNavigate,
}: {
  planet: PlanetData;
  position: number;
  prev: PlanetData | null;
  next: PlanetData | null;
  onNavigate: (id: string) => void;
}) {
  const left = position % 2 === 0; // text side; 3D planet floats opposite
  return (
    <section id={planet.id} className="relative flex min-h-[150vh] items-center px-5 py-28 md:px-10">
      {/* giant ghost index */}
      <div
        className={`text-stroke-faint pointer-events-none absolute top-24 select-none font-display text-[26vw] font-black leading-none lg:text-[19rem] ${
          left ? "right-0" : "left-0"
        }`}
        aria-hidden
      >
        {planet.index}
      </div>

      <div className={`mx-auto grid w-full max-w-[1500px] items-center gap-8 lg:grid-cols-2`}>
        {/* spacer that lets the 3D planet breathe */}
        <div className={`${left ? "order-2" : "order-1"} hidden min-h-[60vh] lg:block`}>
          <div className={`flex h-full flex-col justify-center gap-3 font-mono text-[9px] tracking-[0.35em] text-white/30 ${left ? "items-end pr-8 text-right" : "items-start pl-8"}`}>
            <Reveal><p className="flex items-center gap-2"><Fingerprint className="h-3 w-3" /> {planet.coordinates}</p></Reveal>
            <Reveal delay={0.1}>
              <p className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: planet.accent }} />
                LIVE RENDER — PROCEDURAL BODY
              </p>
            </Reveal>
            <Reveal delay={0.2}><p>DRAG YOUR CURSOR — PARALLAX ACTIVE</p></Reveal>
          </div>
        </div>

        {/* dossier card */}
        <div
          className={`${left ? "order-1" : "order-2"} relative rounded-3xl max-lg:border max-lg:border-white/10 max-lg:bg-[#020108]/60 max-lg:p-6 max-lg:backdrop-blur-md`}
        >
          <ChapterDivider chapter={planet.chapter} index={`CHAPTER ${planet.index}`} />

          <h2 className="font-display mt-5 text-6xl font-black leading-none tracking-tight md:text-8xl">
            <SplitTitle text={planet.name} className="block" letterClass={`bg-gradient-to-br ${planet.gradient} bg-clip-text text-transparent`} />
          </h2>

          <Reveal delay={0.15}>
            <p className="mt-3 text-lg font-light italic tracking-wide md:text-xl" style={{ color: planet.accent }}>
              {planet.epithet}
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.35em] text-white/45">{planet.tagline.toUpperCase()}</p>
          </Reveal>

          <Reveal delay={0.22}>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-base">{planet.description}</p>
            <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-white/50">{planet.longDescription}</p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-6 flex flex-wrap gap-2">
              {planet.traits.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[9px] tracking-[0.25em] text-white/70"
                  style={{ borderColor: `${planet.accent}44`, background: planet.accentSoft }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: planet.accent }} />
                  {t.toUpperCase()}
                </span>
              ))}
            </div>
          </Reveal>

          {/* stats */}
          <div className="mt-7 grid max-w-xl grid-cols-2 gap-2.5 sm:grid-cols-3">
            <Reveal delay={0.32}><Stat icon={Orbit} label="DISTANCE" value={planet.distance} accent={planet.accent} /></Reveal>
            <Reveal delay={0.36}><Stat icon={Ruler} label="DIAMETER" value={planet.diameter} accent={planet.accent} /></Reveal>
            <Reveal delay={0.4}><Stat icon={Sun} label="DAY" value={planet.dayLength} accent={planet.accent} /></Reveal>
            <Reveal delay={0.44}><Stat icon={Timer} label="YEAR" value={planet.yearLength} accent={planet.accent} /></Reveal>
            <Reveal delay={0.48}><Stat icon={Moon} label="MOONS" value={planet.moons} accent={planet.accent} /></Reveal>
            <Reveal delay={0.52}><Stat icon={Thermometer} label="TEMP" value={planet.temp} accent={planet.accent} /></Reveal>
          </div>

          <Reveal delay={0.56}>
            <div className="mt-6 flex max-w-xl items-center gap-4 font-mono text-[9px] tracking-[0.3em] text-white/40">
              <span className="flex items-center gap-2"><Weight className="h-3 w-3" /> GRAVITY {planet.gravity}</span>
              <span className="h-3 w-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
              <span>{planet.distanceKm.toUpperCase()} FROM SUN</span>
            </div>
          </Reveal>

          {/* prev / next */}
          <Reveal delay={0.6}>
            <div className="mt-8 flex max-w-xl items-center gap-3">
              {prev ? (
                <button
                  onClick={() => onNavigate(prev.id)}
                  className="group flex flex-1 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/[0.07]"
                >
                  <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-white/45">
                    <ChevronUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" /> PREV
                  </span>
                  <span className="font-display text-sm font-bold tracking-widest text-white/80">{prev.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate("galaxy")}
                  className="group flex flex-1 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-md transition-all duration-300 hover:border-white/25"
                >
                  <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-white/45">
                    <ChevronUp className="h-3.5 w-3.5" /> PREV
                  </span>
                  <span className="font-display text-sm font-bold tracking-widest text-white/80">GALAXY</span>
                </button>
              )}
              {next ? (
                <button
                  onClick={() => onNavigate(next.id)}
                  className="group flex flex-1 items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${planet.accent}33, ${planet.accent}11)`,
                    border: `1px solid ${planet.accent}55`,
                  }}
                >
                  <span className="font-display text-sm font-bold tracking-widest text-white">{next.name}</span>
                  <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-white/70">
                    NEXT <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate("deep")}
                  className="group flex flex-1 items-center justify-between rounded-2xl border border-cyan-300/40 bg-cyan-300/10 px-5 py-4 transition-all duration-300 hover:bg-cyan-300/20"
                >
                  <span className="font-display text-sm font-bold tracking-widest text-white">DEEP FIELD</span>
                  <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-cyan-200">
                    NEXT <ChevronDown className="h-3.5 w-3.5" />
                  </span>
                </button>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINALE — DEEP FIELD ---------------- */

export function Finale({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <section id="deep" className="relative px-5 pb-10 pt-32 md:px-10">
      <div className="mx-auto max-w-[1200px] text-center">
        <Reveal>
          <div className="mx-auto flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            <span className="font-mono text-[10px] tracking-[0.45em] text-white/70">CHAPTER 09 — DEEP FIELD</span>
          </div>
        </Reveal>

        <h2 className="font-display mt-8 text-5xl font-black leading-[1.02] md:text-7xl">
          <SplitTitle text="THE VOYAGE" className="block" letterClass="text-white" />
          <SplitTitle text="NEVER ENDS" delay={0.2} className="block" letterClass="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent" />
        </h2>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-white/60 md:text-lg">
            You crossed 4.5 billion kilometers and 4.6 billion years — from scorched
            Mercury to the supersonic winds of Neptune. Beyond lies the Kuiper Belt,
            the Oort Cloud, and interstellar space itself.
          </p>
        </Reveal>

        {/* mission complete stats */}
        <Reveal delay={0.4}>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4">
            {[
              { v: 8, s: "/8", l: "WORLDS VISITED" },
              { v: 288, s: "+", l: "MOONS CATALOGUED" },
              { v: 100, s: "%", l: "MISSION COMPLETE" },
            ].map((s) => (
              <div key={s.l} className="glass rounded-2xl p-5">
                <p className="font-display text-3xl font-black text-white md:text-4xl">
                  <Counter to={s.v} suffix={s.s} />
                </p>
                <p className="mt-1 font-mono text-[8.5px] tracking-[0.3em] text-white/45">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* planet index grid */}
        <Reveal delay={0.45}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PLANETS.map((p) => (
              <button
                key={p.id}
                onClick={() => onNavigate(p.id)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/25"
              >
                <span
                  className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-30 blur-2xl transition-opacity duration-300 group-hover:opacity-70"
                  style={{ background: p.accent }}
                />
                <span className="font-mono text-[9px] tracking-[0.3em] text-white/40">{p.index}</span>
                <span className="font-display mt-1 block text-lg font-bold text-white">{p.name}</span>
                <span className="mt-1 block truncate text-xs text-white/45">{p.epithet}</span>
                <ArrowUpRight className="mt-3 h-4 w-4 text-white/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white" />
              </button>
            ))}
          </div>
        </Reveal>

        {/* crew signup */}
        <Reveal delay={0.5}>
          <div className="glass relative mx-auto mt-12 max-w-2xl overflow-hidden rounded-3xl p-8 md:p-10">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
              <span className="absolute left-0 top-0 h-px w-full animate-[scan_4s_linear_infinite] bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
            </div>
            {!joined ? (
              <>
                <h3 className="font-display text-2xl font-bold text-white">JOIN THE CREW</h3>
                <p className="mt-2 text-sm text-white/55">Receive transmission logs from the next voyage — exoplanets, black holes, and beyond.</p>
                <form
                  className="mt-6 flex flex-col gap-3 sm:flex-row"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (email.trim()) setJoined(true);
                  }}
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="commander@starship.earth"
                    className="flex-1 rounded-full border border-white/15 bg-black/40 px-6 py-3.5 font-mono text-xs tracking-wider text-white placeholder:text-white/30 focus:border-cyan-300/60 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-8 py-3.5 font-mono text-[11px] tracking-[0.3em] text-white transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.6)]"
                  >
                    ENLIST
                  </button>
                </form>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/10">
                  <Satellite className="h-6 w-6 text-emerald-300" />
                </div>
                <h3 className="font-display mt-4 text-2xl font-bold text-white">TRANSMISSION RECEIVED</h3>
                <p className="mt-2 font-mono text-xs tracking-[0.2em] text-emerald-200/80">WELCOME ABOARD, COMMANDER — {email.toUpperCase()}</p>
              </motion.div>
            )}
          </div>
        </Reveal>

        {/* footer */}
        <footer className="mt-16 border-t border-white/[0.07] pt-8">
          <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
            <div className="flex items-center gap-3">
              <Orbit className="h-4 w-4 text-cyan-300" />
              <span className="font-display text-sm font-bold tracking-[0.2em] text-white">ODYSSEY</span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-white/35">© 2026 DEEP SPACE PROGRAM</span>
            </div>
            <div className="flex items-center gap-6 font-mono text-[9px] tracking-[0.3em] text-white/40">
              <button onClick={() => onNavigate("void")} className="transition-colors hover:text-white">RESTART VOYAGE ↑</button>
              <span className="h-3 w-px bg-white/15" />
              <span>RENDERED IN REAL-TIME 3D</span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

/* ---------------- SIDE RAIL ---------------- */

export function SideRail({
  activeIndex,
  onNavigate,
}: {
  activeIndex: number;
  onNavigate: (id: string) => void;
}) {
  const ids = ["void", "galaxy", ...PLANETS.map((p) => p.id), "deep"];
  return (
    <div className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-1 xl:flex">
      <span className="mb-3 font-mono text-[8px] tracking-[0.4em] text-white/30 [writing-mode:vertical-rl]">TRAJECTORY</span>
      {ids.map((id, i) => (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className="group relative flex h-7 w-7 items-center justify-center"
          aria-label={id}
        >
          <span className="absolute right-9 hidden whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-3 py-1 font-mono text-[8.5px] tracking-[0.3em] text-white/70 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:opacity-100 md:block">
            {id.toUpperCase()}
          </span>
          <span
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "h-2.5 w-2.5 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,1)]"
                : i < activeIndex
                  ? "h-1.5 w-1.5 bg-violet-400/80"
                  : "h-1.5 w-1.5 bg-white/20 group-hover:bg-white/50"
            }`}
          />
        </button>
      ))}
      <span className="mt-3 h-16 w-px bg-gradient-to-b from-cyan-300/50 to-transparent" />
    </div>
  );
}

/* ---------------- BOTTOM HUD ---------------- */

export function BottomHud({ progress }: { progress: number }) {
  const ly = (progress * 4.5).toFixed(2);
  return (
    <>
      <div className="fixed bottom-5 left-5 z-40 hidden font-mono text-[9px] tracking-[0.25em] text-white/40 md:left-8 lg:block">
        <p>DIST FROM SOL — <span className="text-cyan-300/90">{ly}B KM</span></p>
        <div className="mt-2 h-px w-44 bg-white/10">
          <div className="h-px bg-cyan-300/80" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <div className="fixed bottom-5 right-5 z-40 hidden text-right font-mono text-[9px] tracking-[0.25em] text-white/40 md:right-8 lg:block">
        <p>Voyage completion</p>
        <p className="font-display mt-1 text-xl font-bold tracking-normal text-white">
          {(progress * 100).toFixed(0)}<span className="text-sm text-white/50">%</span>
        </p>
      </div>
    </>
  );
}
