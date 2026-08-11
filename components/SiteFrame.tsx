"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useFocusTrap } from "@/lib/useFocusTrap";
import Logo from "@/components/Logo";
import CustomCursor from "@/components/CustomCursor";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Collection" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteFrame({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const frame = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useFocusTrap(overlay, menuOpen);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".site-header, .site-footer",
        { y: reduced ? 0 : -10, opacity: reduced ? 1 : 0 },
        {
          y: 0,
          opacity: 1,
          duration: reduced ? 0 : 1.05,
          ease: "power3.out",
          stagger: reduced ? 0 : 0.08,
          clearProps: "transform",
        }
      );
    }, frame);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    document.body.style.overflow = "hidden";
    closeButton.current?.focus();

    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      gsap.fromTo(".nav-overlay", { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.5, ease: "power2.out" });
      gsap.fromTo(
        ".nav-overlay-link",
        { x: reduced ? 0 : (i: number) => (i % 2 === 0 ? -90 : 90), opacity: reduced ? 1 : 0 },
        { x: 0, opacity: 1, duration: reduced ? 0 : 1.1, stagger: reduced ? 0 : 0.18, ease: "power3.out", delay: reduced ? 0 : 0.15 }
      );
    }, overlay);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      ctx.revert();
    };
  }, [menuOpen]);

  return (
    <div ref={frame} className="site-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="paper-noise" aria-hidden="true" />

      <CustomCursor />

      <Link href="/" className="site-logo" aria-label="Sofia's Photography — Home" />

      <ThemeToggle />

      <header className="site-header">
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="site-nav-overlay"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
      </header>

      <main id="main-content" tabIndex={-1}>
        {children}
      </main>

      <div className="footer-reveal-spacer" aria-hidden="true" />

      <footer className="site-footer">
        <nav className="legal-links" aria-label="Legal navigation">
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Datenschutz</Link>
        </nav>
      </footer>

      {menuOpen && (
        <div
          ref={overlay}
          id="site-nav-overlay"
          className="nav-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <Logo className="nav-overlay-logo" />

          <button
            ref={closeButton}
            type="button"
            className="nav-overlay-close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <span className="nav-overlay-close-bar" />
            <span className="nav-overlay-close-bar" />
          </button>

          <nav className="nav-overlay-links" aria-label="Primary navigation">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-overlay-link${isActive ? " active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
