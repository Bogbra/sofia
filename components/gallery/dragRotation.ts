import { MathUtils } from "three";

type DragState = { active: boolean; x: number; y: number };
type Vector2State = { x: number; y: number };

// Wires pointer-drag input on `element` into the given mutable refs: `drag`
// tracks whether a drag is in progress, `rotation`/`velocity` feed the
// sphere's per-frame animation in Scene, and `dragDistance` lets a click be
// told apart from a drag. Kept as a plain function (not a hook) so the refs
// stay owned by the component that renders the sphere.
export function attachDragListeners(
  element: HTMLElement,
  refs: {
    drag: { current: DragState };
    rotation: { current: Vector2State };
    velocity: { current: Vector2State };
    dragDistance: { current: number };
  }
) {
  const { drag, rotation, velocity, dragDistance } = refs;

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
    rotation.current.x = MathUtils.clamp(rotation.current.x + dy * 0.0024, -0.42, 0.42);
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
}
