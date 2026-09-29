export interface PlanetData {
  id: string;
  index: string;
  chapter: string;
  name: string;
  epithet: string;
  tagline: string;
  description: string;
  longDescription: string;
  distance: string;
  distanceKm: string;
  diameter: string;
  dayLength: string;
  yearLength: string;
  moons: string;
  temp: string;
  gravity: string;
  accent: string;
  accentSoft: string;
  gradient: string;
  palette: string[];
  bands: boolean;
  ring: boolean;
  ringColor?: string;
  atmosphere: string;
  size: number;
  traits: string[];
  coordinates: string;
}

export const PLANETS: PlanetData[] = [
  {
    id: "mercury",
    index: "01",
    chapter: "TERRESTRIAL I",
    name: "MERCURY",
    epithet: "The Scorched Messenger",
    tagline: "A world of extremes racing around the Sun",
    description:
      "Mercury is the swiftest planet — a cratered iron heart wrapped in a whisper of rock, enduring the most violent temperature swings in the solar system.",
    longDescription:
      "Stripped nearly to its metallic core by an ancient cataclysm, Mercury races through its year in just 88 days. By day its surface melts at 430°C; by night it plunges to −180°C — a world forever caught between fire and ice.",
    distance: "0.39 AU",
    distanceKm: "57.9M km",
    diameter: "4,879 km",
    dayLength: "59 Earth days",
    yearLength: "88 days",
    moons: "0",
    temp: "167°C avg",
    gravity: "3.7 m/s²",
    accent: "#c9b8a3",
    accentSoft: "rgba(201,184,163,0.15)",
    gradient: "from-stone-300 via-amber-200/60 to-stone-500",
    palette: ["#8a7f72", "#5c564c", "#b8a88a", "#3d3831"],
    bands: false,
    ring: false,
    atmosphere: "rgba(200,180,150,0.25)",
    size: 2.1,
    traits: ["Iron Core", "Cratered", "No Atmosphere"],
    coordinates: "X:−04.2 / Y:+01.7 / Z:−060",
  },
  {
    id: "venus",
    index: "02",
    chapter: "TERRESTRIAL II",
    name: "VENUS",
    epithet: "The Veiled Inferno",
    tagline: "Beauty wrapped around a runaway greenhouse hell",
    description:
      "Beneath its pearlescent clouds of acid, Venus is the hottest planet — a crushed, volcanic world where lead would melt on the surface.",
    longDescription:
      "Venus spins backwards beneath an atmosphere 92 times heavier than Earth's. Its CO₂ shroud trapped the Sun's heat in a runaway cascade, forging surface pressures that would crush a submarine and rains of pure sulfuric acid.",
    distance: "0.72 AU",
    distanceKm: "108.2M km",
    diameter: "12,104 km",
    dayLength: "243 days ↺",
    yearLength: "225 days",
    moons: "0",
    temp: "464°C",
    gravity: "8.9 m/s²",
    accent: "#f2c979",
    accentSoft: "rgba(242,201,121,0.14)",
    gradient: "from-amber-200 via-yellow-400/70 to-orange-500",
    palette: ["#e8c47a", "#c98f3a", "#f5e0a8", "#a8641e"],
    bands: true,
    ring: false,
    atmosphere: "rgba(242,201,121,0.35)",
    size: 3.0,
    traits: ["Retrograde Spin", "Acid Clouds", "92 bar Pressure"],
    coordinates: "X:+03.8 / Y:−02.1 / Z:−130",
  },
  {
    id: "earth",
    index: "03",
    chapter: "TERRESTRIAL III",
    name: "EARTH",
    epithet: "The Living Oasis",
    tagline: "The only known world where the universe woke up",
    description:
      "A pale blue miracle — the only world with liquid-water oceans, oxygen skies, and life gazing back at the stars it came from.",
    longDescription:
      "Earth sits in the razor-thin habitable zone where water stays liquid. A magnetic heart shields its biosphere from solar wind, while a single oversized Moon steadies its tilt — a chain of cosmic accidents that made you possible.",
    distance: "1.00 AU",
    distanceKm: "149.6M km",
    diameter: "12,742 km",
    dayLength: "23.9 hours",
    yearLength: "365.25 days",
    moons: "1",
    temp: "15°C avg",
    gravity: "9.8 m/s²",
    accent: "#4cc9ff",
    accentSoft: "rgba(76,201,255,0.14)",
    gradient: "from-sky-300 via-blue-500 to-emerald-400",
    palette: ["#1d5fd1", "#2b9fe8", "#34d399", "#0a2a6b"],
    bands: false,
    ring: false,
    atmosphere: "rgba(76,201,255,0.45)",
    size: 3.1,
    traits: ["Liquid Oceans", "O₂ Atmosphere", "Magnetic Shield"],
    coordinates: "X:−02.9 / Y:+01.2 / Z:−200",
  },
  {
    id: "mars",
    index: "04",
    chapter: "TERRESTRIAL IV",
    name: "MARS",
    epithet: "The Rust Frontier",
    tagline: "Humanity's next shore — cold, red, waiting",
    description:
      "The rust-red desert world holds the tallest volcano and deepest canyon known — and the frozen echoes of rivers that flowed billions of years ago.",
    longDescription:
      "Olympus Mons rises three times higher than Everest while Valles Marineris could swallow the Grand Canyon whole. Mars lost its magnetic heart, and its air bled into space — yet beneath the dust, water ice waits for the first human footprints.",
    distance: "1.52 AU",
    distanceKm: "227.9M km",
    diameter: "6,779 km",
    dayLength: "24.6 hours",
    yearLength: "687 days",
    moons: "2",
    temp: "−63°C avg",
    gravity: "3.7 m/s²",
    accent: "#ff6b4a",
    accentSoft: "rgba(255,107,74,0.14)",
    gradient: "from-orange-400 via-red-500 to-rose-700",
    palette: ["#c1441e", "#8f2d12", "#ff8c5a", "#5c1a0a"],
    bands: false,
    ring: false,
    atmosphere: "rgba(255,107,74,0.3)",
    size: 2.6,
    traits: ["Olympus Mons", "Polar Ice", "Dust Storms"],
    coordinates: "X:+04.4 / Y:+02.6 / Z:−270",
  },
  {
    id: "jupiter",
    index: "05",
    chapter: "GAS GIANT I",
    name: "JUPITER",
    epithet: "The Colossal Guardian",
    tagline: "Two and a half times all other planets combined",
    description:
      "The king of planets — a storm-wracked colossus whose gravity shields the inner worlds, devouring comets meant for Earth.",
    longDescription:
      "The Great Red Spot is a hurricane wider than Earth that has raged for centuries. Deep below the ammonia clouds, hydrogen is crushed into liquid metal, powering the most powerful magnetic field in the solar system — a shield 20,000 times Earth's.",
    distance: "5.20 AU",
    distanceKm: "778.5M km",
    diameter: "139,820 km",
    dayLength: "9.9 hours",
    yearLength: "11.9 years",
    moons: "95",
    temp: "−110°C",
    gravity: "24.8 m/s²",
    accent: "#e8a86b",
    accentSoft: "rgba(232,168,107,0.14)",
    gradient: "from-amber-300 via-orange-400 to-red-400",
    palette: ["#d8a06a", "#a8642e", "#f0d0a0", "#7c4a24"],
    bands: true,
    ring: false,
    atmosphere: "rgba(232,168,107,0.3)",
    size: 6.4,
    traits: ["Great Red Spot", "95 Moons", "Metallic H₂ Core"],
    coordinates: "X:−05.1 / Y:−01.8 / Z:−360",
  },
  {
    id: "saturn",
    index: "06",
    chapter: "GAS GIANT II",
    name: "SATURN",
    epithet: "The Ringed Monarch",
    tagline: "A jewel of ice spanning 280,000 kilometers",
    description:
      "Saturn's rings are billions of glittering ice shards — the shattered remains of a moon, spread into the most perfect structure in the solar system.",
    longDescription:
      "Though 280,000 km wide, the rings are in places just 10 meters thick — proportionally thinner than a sheet of paper. Saturn itself is so light it would float in water, while its moon Enceladus sprays ocean water into space from tiger-stripe geysers.",
    distance: "9.58 AU",
    distanceKm: "1.43B km",
    diameter: "116,460 km",
    dayLength: "10.7 hours",
    yearLength: "29.4 years",
    moons: "146",
    temp: "−140°C",
    gravity: "10.4 m/s²",
    accent: "#f0d9a8",
    accentSoft: "rgba(240,217,168,0.14)",
    gradient: "from-yellow-100 via-amber-300 to-yellow-600",
    palette: ["#e3c888", "#b8965a", "#f5e8c8", "#8a6a35"],
    bands: true,
    ring: true,
    ringColor: "#e8d5a3",
    atmosphere: "rgba(240,217,168,0.3)",
    size: 5.6,
    traits: ["146 Moons", "Ice Rings", "Hexagon Storm"],
    coordinates: "X:+04.8 / Y:+01.9 / Z:−450",
  },
  {
    id: "uranus",
    index: "07",
    chapter: "ICE GIANT I",
    name: "URANUS",
    epithet: "The Sideways Giant",
    tagline: "Knocked on its side, rolling around the Sun",
    description:
      "Uranus spins on its side at a 98° tilt — likely from an ancient collision — so each pole takes a 21-year turn facing the Sun.",
    longDescription:
      "Methane in its frigid atmosphere drinks red light and breathes out an electric cyan glow. Uranus is the coldest planetary atmosphere ever measured at −224°C, yet it radiates almost no internal heat — a frozen enigma rolling silently through the dark.",
    distance: "19.2 AU",
    distanceKm: "2.87B km",
    diameter: "50,724 km",
    dayLength: "17.2 hours",
    yearLength: "84 years",
    moons: "28",
    temp: "−195°C",
    gravity: "8.9 m/s²",
    accent: "#6ff5e7",
    accentSoft: "rgba(111,245,231,0.13)",
    gradient: "from-teal-200 via-cyan-400 to-emerald-400",
    palette: ["#6fd8d4", "#3aa8a3", "#b8f5ef", "#1e6e6a"],
    bands: true,
    ring: true,
    ringColor: "rgba(150,240,235,0.5)",
    atmosphere: "rgba(111,245,231,0.35)",
    size: 4.2,
    traits: ["98° Tilt", "−224°C Record", "Methane Haze"],
    coordinates: "X:−04.0 / Y:+02.4 / Z:−540",
  },
  {
    id: "neptune",
    index: "08",
    chapter: "ICE GIANT II",
    name: "NEPTUNE",
    epithet: "The Azure Abyss",
    tagline: "The windiest world — 2,100 km/h supersonic storms",
    description:
      "The farthest planet — a deep-blue giant of supersonic winds and diamond rain, found by mathematics before any telescope saw it.",
    longDescription:
      "Neptune's winds are the fastest in the solar system, tearing at 2,100 km/h through an atmosphere of crushing ice. So distant the Sun is a mere bright star, yet it glows vivid blue — and deep inside, carbon crystallizes and falls as diamond rain.",
    distance: "30.1 AU",
    distanceKm: "4.50B km",
    diameter: "49,244 km",
    dayLength: "16.1 hours",
    yearLength: "164.8 years",
    moons: "16",
    temp: "−200°C",
    gravity: "11.2 m/s²",
    accent: "#6b8cff",
    accentSoft: "rgba(107,140,255,0.15)",
    gradient: "from-indigo-400 via-blue-600 to-cyan-500",
    palette: ["#2a4bd1", "#16277c", "#6b9bff", "#0a1440"],
    bands: true,
    ring: false,
    atmosphere: "rgba(107,140,255,0.4)",
    size: 4.1,
    traits: ["Supersonic Winds", "Diamond Rain", "Found by Math"],
    coordinates: "X:+03.2 / Y:−02.8 / Z:−630",
  },
];

export const CHAPTERS = [
  { id: "void", label: "VOID", sub: "Departure" },
  { id: "galaxy", label: "GALAXY", sub: "Milky Way Gate" },
  ...PLANETS.map((p) => ({ id: p.id, label: p.name, sub: p.epithet })),
  { id: "deep", label: "DEEP FIELD", sub: "Beyond" },
];
