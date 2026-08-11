"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useFocusTrap } from "@/lib/useFocusTrap";

type LightboxArtwork = {
  src: string;
  title: string;
};

export default function Lightbox({
  artworks,
  index,
  onClose,
  onNavigate,
}: {
  artworks: LightboxArtwork[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const overlay = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const total = artworks.length;
  const current = artworks[index];

  useFocusTrap(overlay, true);

  useEffect(() => {
    closeButton.current?.focus();
  }, []);

  useEffect(() => {
    const goPrev = () => onNavigate((index - 1 + total) % total);
    const goNext = () => onNavigate((index + 1) % total);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [index, total, onClose, onNavigate]);

  useEffect(() => {
    if (!overlay.current) return;
    const duration = prefersReducedMotion() ? 0 : 0.35;
    gsap.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration, ease: "power2.out" });
  }, []);

  return (
    <div
      ref={overlay}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={current.title}
      onClick={onClose}
    >
      <button
        ref={closeButton}
        type="button"
        className="lightbox-close"
        aria-label="Close"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
      >
        ×
      </button>

      {total > 1 && (
        <button
          type="button"
          className="lightbox-arrow lightbox-prev"
          aria-label="Previous artwork"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate((index - 1 + total) % total);
          }}
        >
          ‹
        </button>
      )}

      <img
        key={current.src}
        src={current.src}
        alt={current.title}
        className="lightbox-image"
        onClick={(event) => event.stopPropagation()}
      />

      {total > 1 && (
        <button
          type="button"
          className="lightbox-arrow lightbox-next"
          aria-label="Next artwork"
          onClick={(event) => {
            event.stopPropagation();
            onNavigate((index + 1) % total);
          }}
        >
          ›
        </button>
      )}
    </div>
  );
}
