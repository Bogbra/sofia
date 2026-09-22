// Regenerates public/artworks/gallery/*.webp — the downscaled copies the 3D
// gallery loads as WebGL textures — from the full-resolution originals in
// public/artworks/.
//
// WebGL uploads WebP textures to the GPU uncompressed, so file size on disk
// doesn't bound GPU memory the way it does for a normal <img>. Capping the
// longest edge at GALLERY_MAX_EDGE keeps that budget reasonable on mobile
// GPUs. Run after adding or replacing a photo in public/artworks/:
//
//   npm run generate:gallery-thumbs

import { readdir, mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const GALLERY_MAX_EDGE = 900;
const ARTWORKS_DIR = path.join(process.cwd(), "public", "artworks");
const GALLERY_DIR = path.join(ARTWORKS_DIR, "gallery");

// public/artworks/ also holds images that aren't part of the 3D collection
// (e.g. the About page portrait) and must not get a gallery/ copy, since
// lib/artworks.ts turns every file in gallery/ into a collection entry.
const EXCLUDE = new Set(["Sofia.webp"]);

async function main() {
  await mkdir(GALLERY_DIR, { recursive: true });

  const files = (await readdir(ARTWORKS_DIR, { withFileTypes: true }))
    .filter(
      (entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".webp") && !EXCLUDE.has(entry.name)
    );

  // Remove stale thumbnails whose source was deleted or renamed, so
  // getArtworks() never picks up a gallery/ entry with no original behind it.
  const expected = new Set(files.map((file) => file.name));
  const existingThumbs = (await readdir(GALLERY_DIR, { withFileTypes: true })).filter(
    (entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".webp")
  );
  for (const thumb of existingThumbs) {
    if (!expected.has(thumb.name)) {
      await unlink(path.join(GALLERY_DIR, thumb.name));
      console.log(`removed orphaned gallery/${thumb.name}`);
    }
  }

  for (const file of files) {
    const input = path.join(ARTWORKS_DIR, file.name);
    const output = path.join(GALLERY_DIR, file.name);

    await sharp(input)
      .resize({
        width: GALLERY_MAX_EDGE,
        height: GALLERY_MAX_EDGE,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(output);

    console.log(`generated gallery/${file.name}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
