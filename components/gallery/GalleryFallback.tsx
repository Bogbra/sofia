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
          <img src={item.thumbSrc} alt={item.title} loading="lazy" />
          <span>{item.title}</span>
        </button>
      ))}
    </div>
  );
}
