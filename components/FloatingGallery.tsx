"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import Lightbox from "@/components/Lightbox";
import type { ArtworkSpec } from "@/lib/artworks";
import { GalleryFallback } from "@/components/gallery/GalleryFallback";
import { Scene } from "@/components/gallery/Scene";

function checkWebglSupport() {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    // three.js dropped WebGLRenderer's WebGL1 fallback in r163, so a
    // device with WebGL1 but no WebGL2 can pass a WebGL1-only check here
    // and then still fail to construct the renderer.
    return !!canvas.getContext("webgl2");
  } catch {
    return false;
  }
}

export default function FloatingGallery({ artworks }: { artworks: ArtworkSpec[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [webglAvailable, setWebglAvailable] = useState(() => checkWebglSupport());

  return (
    <div
      className={`gallery-canvas${lightboxIndex !== null ? " lightbox-open" : ""}`}
      aria-label="Sofia interactive floating photography gallery"
    >
      {webglAvailable ? (
        <>
          <ul className="gallery-keyboard-list" aria-label="Photography collection">
            {artworks.map((item, index) => (
              <li key={item.src}>
                <button type="button" onClick={() => setLightboxIndex(index)}>
                  View photo: {item.title}
                </button>
              </li>
            ))}
          </ul>

          <Canvas
            dpr={[1, 1.75]}
            frameloop={lightboxIndex !== null ? "never" : "always"}
            camera={{ position: [0, 0, 11.8], fov: 42, near: 0.1, far: 100 }}
            gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (event) => {
                event.preventDefault();
                setWebglAvailable(false);
              });
            }}
          >
            <Suspense fallback={null}>
              <Scene artworks={artworks} onSelect={setLightboxIndex} />
            </Suspense>
          </Canvas>
        </>
      ) : (
        <GalleryFallback artworks={artworks} onSelect={setLightboxIndex} />
      )}

      {lightboxIndex !== null && (
        <Lightbox
          artworks={artworks}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </div>
  );
}
