import { Vector3 } from "three";

export function spherePosition(index: number, total: number) {
  if (total <= 1) {
    return new Vector3(0, 0, 0);
  }

  const golden = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (index / (total - 1)) * 2;
  const radius = Math.sqrt(1 - y * y);
  const theta = golden * index;
  return new Vector3(Math.cos(theta) * radius * 7.4, y * 4.4, Math.sin(theta) * radius * 5.4);
}
