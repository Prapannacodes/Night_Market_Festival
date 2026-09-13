export const EVENT = {
  code: "ACM/PS/03",
  name: "NIGHT MARKET",
  date: "12 OCTOBER 2026",
  dateShort: "12 OCT 2026",
  place: "CITY CENTER",
  hours: "7PM — 1AM",
}

export const CATEGORIES = [
  {
    id: "food",
    num: "01",
    title: "FOOD",
    line: "Smoke. Spice. Fire.",
    copy: "Wok flares, late-night broth, sugar smoke curling over the alley.",
    tone: "#ff6a1a",
  },
  {
    id: "fashion",
    num: "02",
    title: "FASHION",
    line: "Streetwear after sunset.",
    copy: "Limited drops from studios that only open when the neon does.",
    tone: "#ff2ec8",
  },
  {
    id: "art",
    num: "03",
    title: "ART",
    line: "Make something impossible.",
    copy: "Projection, print, glitch, and handmade objects that refuse to sit still.",
    tone: "#b44cff",
  },
  {
    id: "music",
    num: "04",
    title: "MUSIC",
    line: "Turn the city into a speaker.",
    copy: "Bass from the main stage, vinyl from the side street, a choir of generators.",
    tone: "#2af0ff",
  },
  {
    id: "performance",
    num: "05",
    title: "PERFORMANCE",
    line: "Lights down. Energy up.",
    copy: "Bodies, light, and a crowd that becomes part of the set.",
    tone: "#ffb020",
  },
]

export const DISHES = [
  {
    id: "ramen",
    name: "Void Broth Ramen",
    vendor: "MIDNIGHT RAMEN",
    spice: 3,
    tag: "SIGNATURE DISH",
    glyph: "麺",
  },
  {
    id: "skewers",
    name: "Neon Skewers",
    vendor: "SMOKE & SPICE",
    spice: 4,
    tag: "AVAILABLE TONIGHT",
    glyph: "串",
  },
  {
    id: "dumplings",
    name: "Moon Dumplings",
    vendor: "MOONCAKE CLUB",
    spice: 1,
    tag: "SIGNATURE DISH",
    glyph: "饺",
  },
  {
    id: "tacos",
    name: "After-Hours Tacos",
    vendor: "NEON NOODLES",
    spice: 2,
    tag: "AVAILABLE TONIGHT",
    glyph: "火",
  },
  {
    id: "drink",
    name: "Cyan Fizz",
    vendor: "LUMEN WORKSHOP",
    spice: 0,
    tag: "SIGNATURE DISH",
    glyph: "液",
  },
]

export const CREATORS = [
  {
    id: "aya",
    name: "AYA MORI",
    discipline: "PROJECTION",
    bio: "Maps entire alley walls into moving constellations.",
  },
  {
    id: "rex",
    name: "REX VALE",
    discipline: "PRINT / GLITCH",
    bio: "Sells posters that degrade if you look too long.",
  },
  {
    id: "nori",
    name: "NORI PARK",
    discipline: "WEARABLE LIGHT",
    bio: "Jackets that pulse with the stage frequency.",
  },
  {
    id: "lumen",
    name: "LUMEN COLLECTIVE",
    discipline: "INSTALLATION",
    bio: "Fog, mirrors, and a corridor you can only walk once.",
  },
  {
    id: "kade",
    name: "KADE ITO",
    discipline: "SOUND SCULPTURE",
    bio: "Turns leftover market generators into instruments.",
  },
  {
    id: "vio",
    name: "VIO SHAW",
    discipline: "PERFORMANCE",
    bio: "A solo set that steals every hanging lantern as a prop.",
  },
]

export const LINEUP = [
  { time: "07:00 PM", act: "DJ KAI", note: "Warm frequency, alley speakers." },
  { time: "08:15 PM", act: "NEON STATIC", note: "Live synth, magenta wash." },
  { time: "09:30 PM", act: "THE MIDNIGHT CLUB", note: "Full-band peak hour." },
  { time: "11:00 PM", act: "SPECIAL PERFORMANCE", note: "Unannounced, main stage." },
  { time: "12:15 AM", act: "FINAL SET", note: "Close the night on one chord." },
]

export const VENDORS = [
  { id: "ramen", name: "MIDNIGHT RAMEN", cat: "FOOD", stall: "A-04" },
  { id: "noodles", name: "NEON NOODLES", cat: "FOOD", stall: "A-11" },
  { id: "spice", name: "SMOKE & SPICE", cat: "FOOD", stall: "B-02" },
  { id: "moon", name: "MOONCAKE CLUB", cat: "SWEETS", stall: "B-09" },
  { id: "studio", name: "AFTER DARK STUDIO", cat: "FASHION", stall: "C-01" },
  { id: "static", name: "STATIC THREADS", cat: "FASHION", stall: "C-07" },
  { id: "lumen", name: "LUMEN WORKSHOP", cat: "ART", stall: "D-03" },
]

export const SCHEDULE = [
  { hour: "7PM", title: "GATES OPEN", detail: "Lanterns ignite. First broth service." },
  { hour: "8PM", title: "FASHION ROW DROP", detail: "Static Threads limited run, 40 pieces." },
  { hour: "9PM", title: "MAIN STAGE PEAK", detail: "The Midnight Club takes the square." },
  { hour: "10PM", title: "ART ALLEY SHIFT", detail: "Lumen corridor opens for 90 minutes." },
  { hour: "11PM", title: "SPECIAL SET", detail: "Identity withheld until the downbeat." },
  { hour: "12AM", title: "AFTER MIDNIGHT", detail: "Night Mode. Fog thickens. Prices stay kind." },
  { hour: "1AM", title: "LAST CALL", detail: "One more song. One more stamp." },
]

export const MAP_NODES = [
  { id: "entry", label: "ENTRY", x: 12, y: 58, copy: "Wristband scan. Lantern given at the gate." },
  { id: "food", label: "FOOD STREET", x: 32, y: 38, copy: "Wok line, dumpling steam, cyan fizz." },
  { id: "fashion", label: "FASHION ROW", x: 52, y: 22, copy: "Runway strip under hanging wires." },
  { id: "art", label: "ART ALLEY", x: 70, y: 40, copy: "Installations in shipping-bay shadows." },
  { id: "stage", label: "MAIN STAGE", x: 58, y: 68, copy: "The square. The speakers. The night." },
  { id: "arcade", label: "ARCADE", x: 38, y: 78, copy: "Cork guns, gold balloons, discount codes." },
  { id: "exit", label: "EXIT", x: 86, y: 72, copy: "Keep the passport. The night keeps you." },
]

export const STAMPS = [
  { id: "nightowl", label: "NIGHT OWL", hint: "Stay with the lantern." },
  { id: "foodie", label: "FOODIE", hint: "Scan the stalls." },
  { id: "art-hunter", label: "ART HUNTER", hint: "Meet a maker." },
  { id: "music-lover", label: "MUSIC LOVER", hint: "Touch the frequency." },
  { id: "explorer", label: "MARKET EXPLORER", hint: "Find the lights." },
]

export const INTRO_WORDS = [
  { text: "A", depth: 0 },
  { text: "CITY", depth: 1 },
  { text: "THAT", depth: 0 },
  { text: "COMES", depth: 2 },
  { text: "ALIVE", depth: 1 },
  { text: "AFTER", depth: 0 },
  { text: "DARK.", depth: 2 },
]
