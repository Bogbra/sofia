"use client";

import { useEffect, useRef } from "react";

function isTextInput(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  const el = target.closest("input, textarea");
  if (!el) return false;
  if (el.tagName === "TEXTAREA") return true;
  const type = (el as HTMLInputElement).type;
  return !["checkbox", "radio", "button", "submit", "reset"].includes(type);
}

function isInteractiveElement(target: EventTarget | null) {
  return target instanceof Element && !!target.closest("a, button");
}

export default function CustomCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const arrow = arrowRef.current;
    const pointer = pointerRef.current;
    if (!arrow || !pointer) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let domActive = false;
    let galleryActive = false;

    const applyState = (hiddenForText: boolean) => {
      const active = domActive || galleryActive;
      arrow.classList.toggle("custom-cursor--hidden", hiddenForText || active);
      pointer.classList.toggle("custom-cursor--hidden", hiddenForText || !active);
    };

    const handleMove = (event: PointerEvent) => {
      arrow.style.left = pointer.style.left = `${event.clientX}px`;
      arrow.style.top = pointer.style.top = `${event.clientY}px`;
      domActive = isInteractiveElement(event.target);
      arrow.classList.add("custom-cursor--visible");
      pointer.classList.add("custom-cursor--visible");
      applyState(isTextInput(event.target));
    };

    const handleGalleryHover = (event: Event) => {
      galleryActive = (event as CustomEvent<{ active: boolean }>).detail.active;
      applyState(false);
    };

    const handleLeave = () => {
      arrow.classList.remove("custom-cursor--visible");
      pointer.classList.remove("custom-cursor--visible");
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("gallery-hover", handleGalleryHover);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("gallery-hover", handleGalleryHover);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  return (
    <>
      <div ref={arrowRef} className="custom-cursor custom-cursor--arrow" aria-hidden="true" />
      <div ref={pointerRef} className="custom-cursor custom-cursor--pointer" aria-hidden="true" />
    </>
  );
}
