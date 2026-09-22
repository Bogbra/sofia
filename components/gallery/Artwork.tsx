import { ThreeEvent, useLoader } from "@react-three/fiber";
import gsap from "gsap";
import { RefObject, useEffect, useMemo, useRef } from "react";
import { DoubleSide, Group, TextureLoader } from "three";
import type { ArtworkSpec } from "@/lib/artworks";
import { prefersReducedMotion } from "@/lib/motion";
import { spherePosition } from "./spherePosition";

export function Artwork({
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
  dragDistance: RefObject<number>;
}) {
  const texture = useLoader(TextureLoader, item.thumbSrc);
  const group = useRef<Group>(null);
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
        <meshBasicMaterial map={texture} side={DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}
