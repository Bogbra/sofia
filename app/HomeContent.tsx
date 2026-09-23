"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SiteFrame from "@/components/SiteFrame";
import { prefersReducedMotion } from "@/lib/motion";
import type { ArtworkSpec } from "@/lib/artworks";

const FloatingGallery = dynamic(() => import("@/components/FloatingGallery"), {
  ssr: false,
});

export default function HomeContent({ artworks }: { artworks: ArtworkSpec[] }) {
  const root = useRef<HTMLDivElement>(null);
  // Optimistic default: the 3D gallery is the common case, and
  // FloatingGallery reports the real value right after it mounts (see
  // checkWebglSupport()). The hero title and drag hint only make sense
  // over the draggable sphere, not the scrollable fallback grid.
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-title > *",
        { y: reduced ? 0 : 18, opacity: reduced ? 1 : 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 0.7,
          stagger: reduced ? 0 : 0.08,
          ease: "power3.out",
        }
      );
      gsap.fromTo(
        ".drag-hint",
        { opacity: reduced ? 0.58 : 0 },
        { opacity: 0.58, duration: reduced ? 0 : 1.2, delay: reduced ? 0 : 1.4 }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <SiteFrame>
      <div ref={root} className="home-stage">
        <FloatingGallery artworks={artworks} onWebglAvailableChange={setWebglAvailable} />

        {/* The 3D gallery needs WebGL + JS (see FloatingGallery's dynamic
            import with ssr: false) and renders nothing without them. This
            keeps the collection browsable — and its images crawlable — even
            then; browsers strip <noscript> content entirely once JS runs. */}
        <noscript>
          <div className="gallery-fallback">
            {artworks.map((item) => (
              <a key={item.src} className="gallery-fallback-item" href={item.src}>
                {/* next/image needs a browser that runs JS; a plain <img> is
                    the honest fallback for the no-JS path this renders in. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.thumbSrc} alt={item.alt} loading="lazy" />
                <span>{item.title}</span>
              </a>
            ))}
          </div>
        </noscript>

        {webglAvailable && (
          <>
            <header className="hero-title" aria-label="Sofia's Visual Archive">
              <h1>Sofia’s</h1>
              <p>Visual Archive</p>
            </header>

            <p className="drag-hint">Drag to explore</p>
          </>
        )}
      </div>
    </SiteFrame>
  );
}
