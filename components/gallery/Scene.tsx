import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useEffect, useRef } from "react";
import { Group, MathUtils } from "three";
import type { ArtworkSpec } from "@/lib/artworks";
import { prefersReducedMotion } from "@/lib/motion";
import { Artwork } from "./Artwork";
import { attachDragListeners } from "./dragRotation";

export function Scene({
  artworks,
  onSelect,
}: {
  artworks: ArtworkSpec[];
  onSelect: (index: number) => void;
}) {
  const world = useRef<Group>(null);
  const drag = useRef({ active: false, x: 0, y: 0 });
  const rotation = useRef({ x: -0.03, y: 0 });
  const velocity = useRef({ x: 0, y: 0.00055 });
  const dragDistance = useRef(0);
  const reducedMotion = useRef(false);
  const { gl, viewport } = useThree();

  useEffect(() => {
    return attachDragListeners(gl.domElement, { drag, rotation, velocity, dragDistance });
  }, [gl]);

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
      velocity.current.y = MathUtils.lerp(velocity.current.y, 0.00055, 0.025);
      velocity.current.x *= 0.96;
    }
    world.current.rotation.x = MathUtils.lerp(world.current.rotation.x, rotation.current.x, 0.08);
    world.current.rotation.y = MathUtils.lerp(world.current.rotation.y, rotation.current.y, 0.08);
    world.current.position.y = reducedMotion.current
      ? 0
      : Math.sin(state.clock.elapsedTime * 0.32) * 0.12;
  });

  const scale = viewport.width < 7 ? 0.72 : viewport.width < 11 ? 0.86 : 1;

  return (
    <group ref={world} scale={scale}>
      {artworks.map((item, index) => (
        <Suspense key={item.src} fallback={null}>
          <Artwork
            item={item}
            index={index}
            total={artworks.length}
            onSelect={onSelect}
            dragDistance={dragDistance}
          />
        </Suspense>
      ))}
    </group>
  );
}
