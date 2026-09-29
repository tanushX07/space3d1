import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import SpaceScene from "./components/SpaceScene";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import {
  Hero,
  Galaxy,
  Marquee,
  PlanetSection,
  Finale,
  SideRail,
  BottomHud,
} from "./components/Sections";
import { PLANETS } from "./data/planets";

const SECTION_IDS = ["void", "galaxy", ...PLANETS.map((p) => p.id), "deep"];

export default function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const velRef = useRef(0);
  const lastYRef = useRef(0);

  /* ---- Lenis buttery smooth scroll ---- */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  /* ---- lock scroll during boot ---- */
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  /* ---- voyage tracking: progress + active chapter + velocity ---- */
  useEffect(() => {
    if (loading) return;
    let raf = 0;

    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      setProgress(p);

      // velocity in "lightyears per second" (smoothed, cosmetic)
      const raw = Math.abs(y - lastYRef.current);
      lastYRef.current = y;
      velRef.current += (raw * 0.09 - velRef.current) * 0.12;
      setVelocity(Math.min(99, velRef.current * 0.6 + (p > 0 && p < 1 ? 0.4 : 0)));

      // active chapter = section nearest viewport center
      const center = y + window.innerHeight * 0.45;
      let best = 0;
      let bestDist = Infinity;
      SECTION_IDS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.offsetTop;
        const h = el.offsetHeight;
        const mid = top + h / 2;
        const d = Math.abs(mid - center);
        // also accept if center inside section
        const inside = center >= top && center <= top + h;
        const score = inside ? d * 0.4 : d;
        if (score < bestDist) {
          bestDist = score;
          best = i;
        }
      });
      setActiveIndex(best);

      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [loading]);

  const navigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: id === "void" ? 0 : -20, duration: 2.2 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020108] text-white">
      {loading && <Loader onDone={() => setLoading(false)} />}

      {/* 3D universe */}
      <SpaceScene />

      {/* cinematic overlays */}
      <div className="vignette-overlay" />
      <div className="noise-overlay" />

      {/* interface */}
      {!loading && (
        <>
          <Navbar
            progress={progress}
            activeIndex={activeIndex}
            velocity={velocity}
            onNavigate={navigate}
          />
          <SideRail activeIndex={activeIndex} onNavigate={navigate} />
          <BottomHud progress={progress} />
        </>
      )}

      {/* scroll content */}
      <main className="relative z-10">
        <Hero onNavigate={navigate} />
        <Galaxy />
        <Marquee />
        {PLANETS.map((planet, i) => (
          <PlanetSection
            key={planet.id}
            planet={planet}
            position={i}
            prev={i > 0 ? PLANETS[i - 1] : null}
            next={i < PLANETS.length - 1 ? PLANETS[i + 1] : null}
            onNavigate={navigate}
          />
        ))}
        <Finale onNavigate={navigate} />
      </main>
    </div>
  );
}
