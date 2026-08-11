"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import SiteFrame from "@/components/SiteFrame";
import { prefersReducedMotion } from "@/lib/motion";

const FloatingGallery = dynamic(() => import("@/components/FloatingGallery"), {
  ssr: false,
});

export default function HomePage() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-title > *",
        { y: reduced ? 0 : 18, opacity: reduced ? 1 : 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 1.25,
          stagger: reduced ? 0 : 0.11,
          ease: "power3.out",
          delay: reduced ? 0 : 0.35,
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
        <FloatingGallery />

        <header className="hero-title" aria-label="Sofia's Photography">
          <h1>Sofia's</h1>
          <p>Visual Archive</p>
        </header>

        <p className="drag-hint">Drag to explore</p>
      </div>
    </SiteFrame>
  );
}
