"use client";

import { Canvas, ThreeEvent, useFrame, useLoader, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { MutableRefObject, Suspense, useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "@/components/Lightbox";
import { prefersReducedMotion } from "@/lib/motion";

type ArtworkSpec = {
  src: string;
  thumbSrc: string;
  title: string;
};

const artworks: ArtworkSpec[] = [
  { src: "/artworks/35.webp", thumbSrc: "/artworks/gallery/35.webp", title: "35" },
  { src: "/artworks/Baustelle.webp", thumbSrc: "/artworks/gallery/Baustelle.webp", title: "Baustelle" },
  { src: "/artworks/Blatt.webp", thumbSrc: "/artworks/gallery/Blatt.webp", title: "Blatt" },
  { src: "/artworks/Building.webp", thumbSrc: "/artworks/gallery/Building.webp", title: "Building" },
  { src: "/artworks/Ghost.webp", thumbSrc: "/artworks/gallery/Ghost.webp", title: "Ghost" },
  { src: "/artworks/Jazz.webp", thumbSrc: "/artworks/gallery/Jazz.webp", title: "Jazz" },
  { src: "/artworks/MFH.webp", thumbSrc: "/artworks/gallery/MFH.webp", title: "MFH" },
  { src: "/artworks/Mirror.webp", thumbSrc: "/artworks/gallery/Mirror.webp", title: "Mirror" },
  { src: "/artworks/Mood.webp", thumbSrc: "/artworks/gallery/Mood.webp", title: "Mood" },
  { src: "/artworks/NiceToMeetYou.webp", thumbSrc: "/artworks/gallery/NiceToMeetYou.webp", title: "Nice to meet you" },
  { src: "/artworks/P1.webp", thumbSrc: "/artworks/gallery/P1.webp", title: "P1" },
  { src: "/artworks/PaulLamers.webp", thumbSrc: "/artworks/gallery/PaulLamers.webp", title: "Paul Lamers" },
  { src: "/artworks/Pictures.webp", thumbSrc: "/artworks/gallery/Pictures.webp", title: "Pictures" },
  { src: "/artworks/Random.webp", thumbSrc: "/artworks/gallery/Random.webp", title: "Random" },
  { src: "/artworks/Roof.webp", thumbSrc: "/artworks/gallery/Roof.webp", title: "Roof" },
];

function checkWebglSupport() {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function GalleryFallback({ onSelect }: { onSelect: (index: number) => void }) {
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

function spherePosition(index: number, total: number) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (index / (total - 1)) * 2;
  const radius = Math.sqrt(1 - y * y);
  const theta = golden * index;
  return new THREE.Vector3(
    Math.cos(theta) * radius * 7.4,
    y * 4.4,
    Math.sin(theta) * radius * 5.4
  );
}

function Artwork({
  item,
  index,
  total,
  onSelect,
  dragDistance,
}: {
  item: ArtworkSpec;
  index: number;
  total: number;
  onSelect: (index: number) => void;
  dragDistance: MutableRefObject<number>;
}) {
  const texture = useLoader(THREE.TextureLoader, item.thumbSrc);
  const group = useRef<THREE.Group>(null);
  const maxDimension = index % 4 === 0 ? 2.6 : index % 3 === 0 ? 2.15 : 1.75;
  const aspect = texture.image.width / texture.image.height;
  const width = aspect >= 1 ? maxDimension : maxDimension * aspect;
  const height = aspect >= 1 ? maxDimension / aspect : maxDimension;
  const target = useMemo(() => spherePosition(index, total), [index, total]);

  useEffect(() => {
    if (!group.current) return;
    const reduced = prefersReducedMotion();
    gsap.to(group.current.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: reduced ? 0 : 1.5,
      ease: "expo.inOut",
      delay: reduced ? 0 : index * 0.025,
    });
    gsap.to(group.current.rotation, {
      y: Math.atan2(target.x, target.z),
      x: -target.y * 0.018,
      duration: reduced ? 0 : 1.5,
      ease: "expo.inOut",
      delay: reduced ? 0 : index * 0.025,
    });
  }, [index, target]);

  const handleHover = (value: boolean, event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    window.dispatchEvent(new CustomEvent("gallery-hover", { detail: { active: value } }));
    if (!group.current) return;
    gsap.to(group.current.scale, {
      x: value ? 1.13 : 1,
      y: value ? 1.13 : 1,
      z: 1,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh
        onPointerEnter={(e) => handleHover(true, e)}
        onPointerLeave={(e) => handleHover(false, e)}
        onClick={(event) => {
          event.stopPropagation();
          if (dragDistance.current < 6) onSelect(index);
        }}
        renderOrder={2}
      >
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Scene({ onSelect }: { onSelect: (index: number) => void }) {
  const world = useRef<THREE.Group>(null);
  const drag = useRef({ active: false, x: 0, y: 0 });
  const rotation = useRef({ x: -0.03, y: 0 });
  const velocity = useRef({ x: 0, y: 0.00055 });
  const dragDistance = useRef(0);
  const { gl, viewport } = useThree();

  useEffect(() => {
    const element = gl.domElement;
    const down = (event: PointerEvent) => {
      drag.current = { active: true, x: event.clientX, y: event.clientY };
      dragDistance.current = 0;
      element.setPointerCapture?.(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!drag.current.active) return;
      const dx = event.clientX - drag.current.x;
      const dy = event.clientY - drag.current.y;
      dragDistance.current += Math.abs(dx) + Math.abs(dy);
      rotation.current.y += dx * 0.004;
      rotation.current.x = THREE.MathUtils.clamp(rotation.current.x + dy * 0.0024, -0.42, 0.42);
      velocity.current.y = dx * 0.00022;
      velocity.current.x = dy * 0.0001;
      drag.current.x = event.clientX;
      drag.current.y = event.clientY;
    };
    const up = () => {
      drag.current.active = false;
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl]);

  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = prefersReducedMotion();
  }, []);

  useEffect(() => {
    if (!world.current) return;
    const reduced = prefersReducedMotion();
    gsap.fromTo(
      world.current.scale,
      { x: reduced ? 1 : 0.62, y: reduced ? 1 : 0.62, z: reduced ? 1 : 0.62 },
      { x: 1, y: 1, z: 1, duration: reduced ? 0 : 2.2, ease: "expo.out", delay: reduced ? 0 : 0.2 }
    );
  }, []);

  useFrame((state, delta) => {
    if (!world.current) return;
    if (!drag.current.active && !reducedMotion.current) {
      rotation.current.y += velocity.current.y * delta * 60;
      velocity.current.y = THREE.MathUtils.lerp(velocity.current.y, 0.00055, 0.025);
      velocity.current.x *= 0.96;
    }
    world.current.rotation.x = THREE.MathUtils.lerp(world.current.rotation.x, rotation.current.x, 0.08);
    world.current.rotation.y = THREE.MathUtils.lerp(world.current.rotation.y, rotation.current.y, 0.08);
    world.current.position.y = reducedMotion.current
      ? 0
      : Math.sin(state.clock.elapsedTime * 0.32) * 0.12;
  });

  const scale = viewport.width < 7 ? 0.72 : viewport.width < 11 ? 0.86 : 1;

  return (
    <group ref={world} scale={scale}>
      {artworks.map((item, index) => (
        <Artwork
          key={item.src}
          item={item}
          index={index}
          total={artworks.length}
          onSelect={onSelect}
          dragDistance={dragDistance}
        />
      ))}
    </group>
  );
}

export default function FloatingGallery() {
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
              <Scene onSelect={setLightboxIndex} />
            </Suspense>
          </Canvas>
        </>
      ) : (
        <GalleryFallback onSelect={setLightboxIndex} />
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
