import fs from "node:fs";
import path from "node:path";

export type ArtworkSpec = {
  src: string;
  thumbSrc: string;
  title: string;
};

const GALLERY_DIR = path.join(process.cwd(), "public", "artworks", "gallery");

// Filenames that don't read well when split at PascalCase boundaries.
const TITLE_OVERRIDES: Record<string, string> = {
  NiceToMeetYou: "Nice to meet you",
};

function titleFromFilename(base: string) {
  return TITLE_OVERRIDES[base] ?? base.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

// Reads public/artworks/gallery/ at build/request time so dropping a new
// .webp file there is enough to add it to the gallery — no code change
// needed unless it wants a custom title (see TITLE_OVERRIDES above).
export function getArtworks(): ArtworkSpec[] {
  const files = fs
    .readdirSync(GALLERY_DIR)
    .filter((file) => file.toLowerCase().endsWith(".webp"))
    .sort();

  return files.map((file) => {
    const base = file.replace(/\.webp$/i, "");
    return {
      src: `/artworks/${file}`,
      thumbSrc: `/artworks/gallery/${file}`,
      title: titleFromFilename(base),
    };
  });
}
