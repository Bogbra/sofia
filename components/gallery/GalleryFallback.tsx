import Image from "next/image";
import type { ArtworkSpec } from "@/lib/artworks";

export function GalleryFallback({
  artworks,
  onSelect,
}: {
  artworks: ArtworkSpec[];
  onSelect: (index: number) => void;
}) {
  return (
    <div className="gallery-fallback">
      {artworks.map((item, index) => (
        <button
          key={item.src}
          type="button"
          className="gallery-fallback-item"
          onClick={() => onSelect(index)}
        >
          <Image
            src={item.thumbSrc}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sizes="(max-width: 600px) 100vw, 220px"
            loading="lazy"
          />
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
}
