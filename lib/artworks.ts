import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

export type ArtworkSpec = {
  src: string;
  thumbSrc: string;
  title: string;
  alt: string;
  width: number;
  height: number;
};

const ARTWORKS_DIR = path.join(process.cwd(), "public", "artworks");
const GALLERY_DIR = path.join(ARTWORKS_DIR, "gallery");

// Filenames that don't read well when split at PascalCase boundaries.
const TITLE_OVERRIDES: Record<string, string> = {
  NiceToMeetYou: "Nice to meet you",
};

// A short project title (used for the keyboard list and dialog labels) isn't
// a substitute for a real image description, so every file needs one here.
// Missing an entry is a build-time error rather than a silent fallback.
const ALT_TEXT: Record<string, string> = {
  "2lade": "A rapper singing into a microphone on stage, bathed in purple stage lights and smoke.",
  "35": "A dockside loading crane in front of a glass office building, with a television tower in the distance.",
  Baustelle: "A tower crane beside a concrete high-rise under construction on a city waterfront.",
  Blatt: "Close-up of a prayer plant leaf with dark patterns along red veins.",
  Building: "A high-rise clad in a colorful checkerboard facade, seen from street level.",
  Jazz: "A pianist in a floral shirt plays an upright piano beside a double bass and guitar.",
  MFH: "A young man in a black bomber jacket sits in an empty bathtub.",
  Mirror: "A mirrored, egg-shaped rooftop pavilion reflecting the sky above a riverside building.",
  Mood: "A woman exhales smoke in profile, tattoos visible on her raised hand, in front of a mural.",
  NiceToMeetYou: "A young man sticks out his tongue and gives the middle finger to the camera.",
  P1: "Illuminated concrete pillars along a building at night, lit by a street lamp.",
  PaulLamers: "A rusting grain-silo structure labeled Paul Lamers KG, with a crane and glass towers behind it.",
  Pictures: "Framed paintings and portraits leaning against a studio wall.",
  Random: "Overhead view of hands rolling a cigarette on a metal bench.",
  Roof: "Two curved building facades meet at a sharp angle against a clear sky.",
};

function titleFromFilename(base: string) {
  return TITLE_OVERRIDES[base] ?? base.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

function altFromFilename(base: string) {
  const alt = ALT_TEXT[base];
  if (!alt) {
    throw new Error(`Missing alt text for artwork "${base}" — add an entry to ALT_TEXT in lib/artworks.ts`);
  }
  return alt;
}

// Reads public/artworks/gallery/ at build/request time so dropping a new
// .webp file there is enough to add it to the gallery — no code change
// needed unless it wants a custom title (see TITLE_OVERRIDES above). An alt
// description is still required (see ALT_TEXT above).
export function getArtworks(): ArtworkSpec[] {
  const files = fs
    .readdirSync(GALLERY_DIR)
    .filter((file) => file.toLowerCase().endsWith(".webp"))
    .sort();

  return files.map((file) => {
    const base = file.replace(/\.webp$/i, "");
    const { width, height } = imageSize(fs.readFileSync(path.join(ARTWORKS_DIR, file)));
    return {
      src: `/artworks/${file}`,
      thumbSrc: `/artworks/gallery/${file}`,
      title: titleFromFilename(base),
      alt: altFromFilename(base),
      width,
      height,
    };
  });
}
