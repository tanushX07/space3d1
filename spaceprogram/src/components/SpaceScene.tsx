import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Sparkles, Float } from "@react-three/drei";
import * as THREE from "three";
import { PLANETS } from "../data/planets";

/* ============================================================
   PROCEDURAL TEXTURE PAINTERS — no external assets, pure canvas
   ============================================================ */

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function paintPlanetTexture(
  palette: string[],
  bands: boolean,
  seed: number,
  isEarth = false
): THREE.CanvasTexture {
  const W = 1024;
  const H = 512;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const rand = seededRandom(seed);

  // base vertical gradient
  const base = ctx.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, palette[0]);
  base.addColorStop(0.45, palette[1]);
  base.addColorStop(0.75, palette[0]);
  base.addColorStop(1, palette[3] ?? palette[1]);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  if (isEarth) {
    // oceans depth noise
    for (let i = 0; i < 900; i++) {
      const x = rand() * W;
      const y = rand() * H;
      const r = 4 + rand() * 22;
      ctx.beginPath();
      ctx.fillStyle = rand() > 0.5 ? "rgba(10,40,120,0.35)" : "rgba(60,160,255,0.25)";
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // continents
    for (let i = 0; i < 46; i++) {
      const cx = rand() * W;
      const cy = H * 0.15 + rand() * H * 0.7;
      const blobs = 6 + Math.floor(rand() * 10);
      for (let b = 0; b < blobs; b++) {
        const x = cx + (rand() - 0.5) * 150;
        const y = cy + (rand() - 0.5) * 80;
        const r = 8 + rand() * 34;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, rand() > 0.4 ? "#2f9e5f" : "#7a9e3f");
        g.addColorStop(1, "rgba(47,158,95,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // ice caps
    const capT = ctx.createLinearGradient(0, 0, 0, H * 0.12);
    capT.addColorStop(0, "rgba(255,255,255,0.95)");
    capT.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = capT;
    ctx.fillRect(0, 0, W, H * 0.12);
    const capB = ctx.createLinearGradient(0, H, 0, H * 0.88);
    capB.addColorStop(0, "rgba(255,255,255,0.95)");
    capB.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = capB;
    ctx.fillRect(0, H * 0.88, W, H * 0.12);
    // clouds
    for (let i = 0; i < 130; i++) {
      const x = rand() * W;
      const y = rand() * H;
      const w = 30 + rand() * 130;
      const h = 4 + rand() * 12;
      ctx.fillStyle = `rgba(255,255,255,${0.08 + rand() * 0.22})`;
      ctx.beginPath();
      ctx.ellipse(x, y, w, h, (rand() - 0.5) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (bands) {
    // gas giant horizontal bands with turbulence
    let y = 0;
    let bandIdx = 0;
    while (y < H) {
      const bh = 14 + rand() * 46;
      const col = palette[bandIdx % palette.length];
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.55 + rand() * 0.4;
      // wavy band
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= W; x += 16) {
        ctx.lineTo(x, y + Math.sin(x * 0.008 + bandIdx * 2.1) * 6 + (rand() - 0.5) * 4);
      }
      for (let x = W; x >= 0; x -= 16) {
        ctx.lineTo(x, y + bh + Math.sin(x * 0.01 + bandIdx * 1.3) * 5);
      }
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      y += bh * (0.75 + rand() * 0.5);
      bandIdx++;
    }
    // turbulence streaks
    for (let i = 0; i < 420; i++) {
      const x = rand() * W;
      const yy = rand() * H;
      const w = 20 + rand() * 120;
      const h = 1.5 + rand() * 5;
      ctx.fillStyle = rand() > 0.5 ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)";
      ctx.beginPath();
      ctx.ellipse(x, yy, w, h, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // great storm vortices
    const storms = 2 + Math.floor(rand() * 3);
    for (let i = 0; i < storms; i++) {
      const x = rand() * W;
      const yy = H * 0.3 + rand() * H * 0.4;
      const r = 10 + rand() * 26;
      const g = ctx.createRadialGradient(x, yy, 0, x, yy, r * 2.2);
      g.addColorStop(0, "rgba(255,240,220,0.85)");
      g.addColorStop(0.5, palette[1] + "cc");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, yy, r * 2.2, r, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // rocky: mottling + craters
    for (let i = 0; i < 1100; i++) {
      const x = rand() * W;
      const yy = rand() * H;
      const r = 2 + rand() * 18;
      ctx.fillStyle =
        rand() > 0.5
          ? `rgba(255,255,255,${0.03 + rand() * 0.08})`
          : `rgba(0,0,0,${0.04 + rand() * 0.12})`;
      ctx.beginPath();
      ctx.arc(x, yy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // craters
    const craters = 60 + Math.floor(rand() * 80);
    for (let i = 0; i < craters; i++) {
      const x = rand() * W;
      const yy = rand() * H;
      const r = 3 + rand() * rand() * 30;
      ctx.beginPath();
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.arc(x, yy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1.5;
      ctx.arc(x, yy, r, Math.PI * 1.1, Math.PI * 1.7);
      ctx.stroke();
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,255,255,0.10)";
      ctx.arc(x - r * 0.25, yy - r * 0.25, r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // terminator vignette left/right for wrap realism
  const shade = ctx.createLinearGradient(0, 0, W, 0);
  shade.addColorStop(0, "rgba(0,0,0,0.25)");
  shade.addColorStop(0.2, "rgba(0,0,0,0)");
  shade.addColorStop(0.8, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(0,0,0,0.25)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, W, H);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function paintGlowTexture(color: string): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, color);
  g.addColorStop(0.25, color.replace(/[\d.]+\)$/, "0.5)"));
  g.addColorStop(0.6, color.replace(/[\d.]+\)$/, "0.12)"));
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function paintRingTexture(baseColor: string): THREE.CanvasTexture {
  // RingGeometry uses planar UVs, so paint concentric bands on a square canvas.
  // Inner radius maps to ~0.574 of half-size (1.35 / 2.35).
  const S = 1024;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d")!;
  const rand = seededRandom(777);
  const cx = S / 2;
  const cy = S / 2;
  const outer = S / 2;
  const inner = outer * 0.574;

  ctx.clearRect(0, 0, S, S);
  for (let r = Math.floor(inner); r < outer; r++) {
    const t = (r - inner) / (outer - inner); // 0 inner → 1 outer
    // Cassini-like division + a few gaps
    if (t > 0.6 && t < 0.66) continue;
    if (t > 0.82 && t < 0.835) continue;
    const edgeFade = Math.min(1, t / 0.06) * Math.min(1, (1 - t) / 0.05);
    const band = 0.5 + 0.5 * Math.sin(t * 46 + Math.sin(t * 13) * 2);
    const n = rand();
    const alpha = edgeFade * (n > 0.86 ? 0.06 : 0.28 + band * 0.55 + n * 0.2);
    ctx.beginPath();
    ctx.strokeStyle = baseColor;
    ctx.globalAlpha = Math.min(1, alpha);
    ctx.lineWidth = 1.4;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/* ============================================================
   WORLD LAYOUT — planets strung along the voyage path
   ============================================================ */

const PLANET_LAYOUT = [
  { x: 7.2, y: 0.4, z: -80 },
  { x: -7.2, y: -0.6, z: -150 },
  { x: 7.4, y: 0.6, z: -220 },
  { x: -7.0, y: -0.4, z: -290 },
  { x: -10.5, y: 1.0, z: -380 },
  { x: 10.0, y: -1.0, z: -470 },
  { x: -8.6, y: 0.8, z: -560 },
  { x: 8.4, y: -0.8, z: -650 },
];

const CAM_START = 42;
const CAM_END = -730;

/* ============================================================
   COMPONENTS
   ============================================================ */

function ProceduralPlanet({
  planetIndex,
  layout,
}: {
  planetIndex: number;
  layout: { x: number; y: number; z: number };
}) {
  const planet = PLANETS[planetIndex];
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Sprite>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useMemo(
    () =>
      paintPlanetTexture(
        planet.palette,
        planet.bands,
        1000 + planetIndex * 977,
        planet.id === "earth"
      ),
    [planet, planetIndex]
  );

  const glowTex = useMemo(() => paintGlowTexture(planet.atmosphere), [planet]);
  const ringTex = useMemo(
    () => (planet.ring ? paintRingTexture(planet.ringColor ?? "#e8d5a3") : null),
    [planet]
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (0.12 + planetIndex * 0.015);
      if (planet.id === "uranus") meshRef.current.rotation.z = 1.71;
      if (planet.id === "venus") meshRef.current.rotation.y -= delta * 0.16;
    }
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.03;
    if (groupRef.current) {
      groupRef.current.position.y = layout.y + Math.sin(t * 0.4 + planetIndex * 1.7) * 0.5;
    }
    if (glowRef.current) {
      const s = planet.size * (4.4 + Math.sin(t * 1.2 + planetIndex) * 0.15);
      glowRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group ref={groupRef} position={[layout.x, layout.y, layout.z]}>
      {/* glow sprite behind */}
      <sprite ref={glowRef} position={[0, 0, -1]}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.85}
        />
      </sprite>

      {/* planet body */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[planet.size, 96, 96]} />
        <meshStandardMaterial
          map={texture}
          roughness={planet.bands ? 0.75 : 0.95}
          metalness={planet.id === "mercury" ? 0.35 : 0.05}
          emissive={new THREE.Color(planet.accent)}
          emissiveMap={texture}
          emissiveIntensity={0.14}
        />
      </mesh>

      {/* atmosphere shell */}
      <mesh scale={1.045}>
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshBasicMaterial
          color={planet.accent}
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh scale={1.02}>
        <sphereGeometry args={[planet.size, 64, 64]} />
        <meshBasicMaterial
          color={planet.accent}
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* rings */}
      {planet.ring && ringTex && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2.35, 0.25, 0]}>
          <ringGeometry args={[planet.size * 1.35, planet.size * 2.35, 128, 1]} />
          <meshBasicMaterial
            map={ringTex}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
            opacity={0.95}
          />
        </mesh>
      )}

      {/* earth's moon */}
      {planet.id === "earth" && (
        <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.6}>
          <mesh position={[planet.size + 2.6, 1.1, 1.2]}>
            <sphereGeometry args={[0.55, 32, 32]} />
            <meshStandardMaterial color="#c8c8d0" roughness={1} />
          </mesh>
        </Float>
      )}
      {/* orbit path ring (decorative) */}
      <mesh rotation={[Math.PI / 2.15, 0, 0.2]}>
        <ringGeometry args={[planet.size * 2.8, planet.size * 2.82, 128]} />
        <meshBasicMaterial
          color={planet.accent}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function GalaxyCore() {
  const pointsRef = useRef<THREE.Points>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);
  const glowTex = useMemo(() => paintGlowTexture("rgba(168,130,255,0.9)"), []);

  const spiral = useMemo(() => {
    const COUNT = 5200;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const rand = seededRandom(42);
    const cA = new THREE.Color("#a882ff");
    const cB = new THREE.Color("#22d3ee");
    const cC = new THREE.Color("#ff9ecb");
    for (let i = 0; i < COUNT; i++) {
      const arm = i % 3;
      const radius = Math.pow(rand(), 0.6) * 26;
      const angle = (radius * 0.32) + (arm * Math.PI * 2) / 3 + (rand() - 0.5) * 0.7;
      const spread = (rand() - 0.5) * (2.2 + radius * 0.16);
      const spreadY = (rand() - 0.5) * (1.1 + radius * 0.06);
      positions[i * 3] = Math.cos(angle) * radius + spread * 0.4;
      positions[i * 3 + 1] = spreadY;
      positions[i * 3 + 2] = Math.sin(angle) * radius + spread * 0.4;
      const mix = rand();
      const col = mix < 0.55 ? cA : mix < 0.85 ? cB : cC;
      const fade = 1 - radius / 30;
      colors[i * 3] = col.r * (0.35 + fade);
      colors[i * 3 + 1] = col.g * (0.35 + fade);
      colors[i * 3 + 2] = col.b * (0.35 + fade);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.035;
    if (coreRef.current) {
      const s = 3.1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.18;
      coreRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, 0, -6]} rotation={[0.42, 0, -0.12]}>
      <points ref={pointsRef} geometry={spiral}>
        <pointsMaterial
          size={0.32}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* bright core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#f4ecff" transparent opacity={0.95} />
      </mesh>
      <sprite scale={[26, 26, 1]}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </sprite>
      {/* accretion ring */}
      <mesh rotation={[Math.PI / 2.1, 0, 0]}>
        <ringGeometry args={[6.5, 6.62, 128]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.5} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.15, 0.4, 0]}>
        <ringGeometry args={[10.5, 10.58, 128]} />
        <meshBasicMaterial color="#a882ff" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

function NebulaCloud({
  position,
  scale,
  color,
  opacity = 0.16,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  opacity?: number;
}) {
  const tex = useMemo(() => paintGlowTexture(color), [color]);
  const ref = useRef<THREE.Sprite>(null!);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.material.rotation = Math.sin(t * 0.05) * 0.4;
    }
  });
  return (
    <sprite ref={ref} position={position} scale={[scale, scale * 0.7, 1]}>
      <spriteMaterial map={tex} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

function AsteroidBelt() {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const COUNT = 650;
  const data = useMemo(() => {
    const rand = seededRandom(9001);
    const arr: { pos: THREE.Vector3; rot: THREE.Euler; scale: number; speed: number }[] = [];
    for (let i = 0; i < COUNT; i++) {
      const angle = rand() * Math.PI * 2;
      const radius = 14 + rand() * 16;
      arr.push({
        pos: new THREE.Vector3(
          Math.cos(angle) * radius + (rand() - 0.5) * 6,
          (rand() - 0.5) * 9,
          -335 + (rand() - 0.5) * 45
        ),
        rot: new THREE.Euler(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI),
        scale: 0.08 + rand() * rand() * 0.7,
        speed: 0.1 + rand() * 0.5,
      });
    }
    return arr;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      const d = data[i];
      dummy.position.copy(d.pos);
      dummy.position.y += Math.sin(t * d.speed + i) * 0.5;
      dummy.rotation.set(d.rot.x + t * 0.1 * d.speed, d.rot.y + t * 0.14 * d.speed, d.rot.z);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    }
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#8a7a66" roughness={1} metalness={0.1} />
    </instancedMesh>
  );
}

function VoyageDust() {
  const ref = useRef<THREE.Points>(null!);
  const COUNT = 2600;
  const geo = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const rand = seededRandom(1337);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (rand() - 0.5) * 70;
      positions[i * 3 + 1] = (rand() - 0.5) * 44;
      positions[i * 3 + 2] = 40 - rand() * 810;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    // gentle drift toward camera to sell motion
    const t = state.clock.elapsedTime;
    ref.current.position.z = (t * 1.2) % 8;
    ref.current.rotation.y = Math.sin(t * 0.02) * 0.02;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.14}
        color="#bfd4ff"
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function WarpStreaks() {
  const ref = useRef<THREE.Points>(null!);
  const matRef = useRef<THREE.PointsMaterial>(null!);
  const COUNT = 500;
  const geo = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const rand = seededRandom(555);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (rand() - 0.5) * 60;
      positions[i * 3 + 1] = (rand() - 0.5) * 36;
      positions[i * 3 + 2] = 30 - rand() * 780;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  const lastY = useRef(0);
  const vel = useRef(0);

  useFrame(() => {
    const y = window.scrollY;
    const v = Math.abs(y - lastY.current);
    lastY.current = y;
    vel.current += (v - vel.current) * 0.08;
    if (matRef.current) {
      matRef.current.opacity = Math.min(0.85, vel.current * 0.012);
      matRef.current.size = 0.1 + Math.min(0.5, vel.current * 0.008);
    }
    if (ref.current) {
      ref.current.position.z = (ref.current.position.z + vel.current * 0.02) % 20;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        ref={matRef}
        size={0.2}
        color="#9be8ff"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------------- CAMERA RIG — the heart of the voyage ---------------- */

function CameraRig() {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, -20));
  const mouse = useRef({ x: 0, y: 0 });
  const camPos = useRef(new THREE.Vector3(0, 0, CAM_START));
  const lastY = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  useFrame((state) => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const raw = max > 0 ? window.scrollY / max : 0;
    const p = Math.min(1, Math.max(0, raw));

    // scroll velocity for FOV kick
    const v = Math.abs(window.scrollY - lastY.current);
    lastY.current = window.scrollY;
    velocity.current += (v - velocity.current) * 0.06;

    const t = state.clock.elapsedTime;

    // main path — linear + cinematic sway
    const targetZ = CAM_START + (CAM_END - CAM_START) * p;
    const swayX = Math.sin(p * 14.5) * 1.6 + Math.sin(t * 0.18) * 0.35;
    const swayY = Math.cos(p * 11.2) * 1.1 + Math.cos(t * 0.15) * 0.3;

    camPos.current.z += (targetZ - camPos.current.z) * 0.075;
    camPos.current.x += (swayX + mouse.current.x * 2.2 - camPos.current.x) * 0.045;
    camPos.current.y += (swayY - mouse.current.y * 1.4 - camPos.current.y) * 0.045;

    camera.position.copy(camPos.current);

    // look toward next planet ahead for cinematic flyby framing
    let aheadX = 0;
    let bestDist = Infinity;
    for (const L of PLANET_LAYOUT) {
      const d = camPos.current.z - L.z;
      if (d > -30 && d < bestDist) {
        bestDist = d;
        // blend influence: strongest when close
        const influence = Math.max(0, 1 - Math.abs(d - 42) / 90);
        aheadX = L.x * 0.42 * influence;
      }
    }
    // galaxy gaze at start
    if (p < 0.12) aheadX = 0;

    lookTarget.current.x += (aheadX + mouse.current.x * 1.5 - lookTarget.current.x) * 0.04;
    lookTarget.current.y += (-mouse.current.y * 0.8 - lookTarget.current.y) * 0.04;
    lookTarget.current.z = camPos.current.z - 55;

    camera.lookAt(lookTarget.current);
    camera.rotation.z += Math.sin(t * 0.1) * 0.0006 + mouse.current.x * 0.001;

    // FOV widens with scroll velocity = warp feel
    const pc = camera as THREE.PerspectiveCamera;
    const targetFov = 62 + Math.min(22, velocity.current * 0.35);
    if (Math.abs(pc.fov - targetFov) > 0.1) {
      pc.fov += (targetFov - pc.fov) * 0.08;
      pc.updateProjectionMatrix();
    }
  });

  return null;
}

function SceneLights() {
  const ref = useRef<THREE.PointLight>(null!);
  useFrame(() => {
    // light follows camera so planets ahead stay readable
    if (ref.current) {
      ref.current.position.set(14, 9, ref.current.position.z);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      ref.current.position.z = CAM_START + (CAM_END - CAM_START) * p - 18;
    }
  });
  return (
    <>
      <ambientLight intensity={0.32} color="#8a9bff" />
      <pointLight ref={ref} intensity={900} distance={120} decay={1.6} color="#fff2df" position={[14, 9, 30]} />
      <pointLight intensity={1400} distance={90} decay={1.8} color="#b48cff" position={[0, 4, -6]} />
      <directionalLight intensity={1.1} color="#cfe4ff" position={[-18, 12, 10]} />
    </>
  );
}

/* ---------------- MAIN SCENE ---------------- */

export default function SpaceScene() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        camera={{ fov: 62, near: 0.1, far: 900, position: [0, 0, CAM_START] }}
        onCreated={({ gl }) => {
          gl.setClearColor("#020108");
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}
      >
        <fog attach="fog" args={["#020108", 55, 260]} />
        <SceneLights />

        {/* deep star shell */}
        <Stars radius={220} depth={120} count={9000} factor={5} saturation={0.4} fade speed={0.6} />
        <Stars radius={140} depth={60} count={3500} factor={3.4} saturation={0.7} fade speed={1.1} />

        {/* ambient nebulae along the route */}
        <NebulaCloud position={[-30, 8, -40]} scale={90} color="rgba(124,58,237,0.9)" opacity={0.14} />
        <NebulaCloud position={[34, -10, -120]} scale={110} color="rgba(34,211,238,0.85)" opacity={0.10} />
        <NebulaCloud position={[-36, -6, -240]} scale={120} color="rgba(236,72,153,0.8)" opacity={0.08} />
        <NebulaCloud position={[30, 10, -350]} scale={130} color="rgba(124,58,237,0.85)" opacity={0.10} />
        <NebulaCloud position={[-32, -8, -480]} scale={130} color="rgba(245,158,11,0.7)" opacity={0.07} />
        <NebulaCloud position={[28, 6, -600]} scale={140} color="rgba(59,91,255,0.85)" opacity={0.10} />
        <NebulaCloud position={[0, 0, -720]} scale={160} color="rgba(168,130,255,0.8)" opacity={0.12} />

        <GalaxyCore />

        {PLANETS.map((_, i) => (
          <ProceduralPlanet key={PLANETS[i].id} planetIndex={i} layout={PLANET_LAYOUT[i]} />
        ))}

        <AsteroidBelt />
        <VoyageDust />
        <WarpStreaks />

        {/* floating sparkle fields near key beats */}
        <Sparkles count={160} scale={[50, 24, 60]} position={[0, 0, -40]} size={2.4} speed={0.25} color="#c4b5fd" opacity={0.6} />
        <Sparkles count={140} scale={[60, 26, 80]} position={[0, 0, -300]} size={2.2} speed={0.2} color="#9be8ff" opacity={0.5} />
        <Sparkles count={180} scale={[70, 30, 100]} position={[0, 0, -560]} size={2.6} speed={0.22} color="#8ab4ff" opacity={0.55} />

        <CameraRig />
      </Canvas>
    </div>
  );
}
