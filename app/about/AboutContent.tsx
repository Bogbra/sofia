"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SiteFrame from "@/components/SiteFrame";
import Image from "next/image";
import { prefersReducedMotion } from "@/lib/motion";

export default function AboutContent() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".editorial-kicker, .editorial-title, .about-copy > *, .about-image",
        { y: reduced ? 0 : 34, opacity: reduced ? 1 : 0 },
        { y: 0, opacity: 1, duration: reduced ? 0 : 1, stagger: reduced ? 0 : 0.1, ease: "power3.out" }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <SiteFrame>
      <section ref={root} className="content-page about-page">
        <header className="editorial-header">
          <p className="editorial-kicker">About Sofia</p>
          <h1 className="editorial-title">Stories found in light, place and passing moments.</h1>
        </header>

        <div className="about-layout">
          <figure className="about-image">
            <Image
              src="/artworks/Sofia.webp"
              alt="Sofia"
              width={1200}
              height={1600}
              sizes="(max-width: 900px) 100vw, 40vw"
              loading="lazy"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </figure>

          <div className="about-copy">
            <p className="lead">
              Sofia's photography is a personal portfolio created as a space for quiet observations,
              visual experiments and selected stories.
            </p>
            <p>
              The collection brings together portraits, landscapes and everyday details. The work is
              made independently as a hobby and is guided by curiosity rather than a fixed genre.
            </p>

          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
