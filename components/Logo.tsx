export default function Logo({ className }: { className?: string }) {
  return (
    <span
      className={`logo-mark${className ? ` ${className}` : ""}`}
      role="img"
      aria-label="Sofia's Photography"
    />
  );
}
