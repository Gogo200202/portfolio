import { useEffect } from "react";

const WASD = ["w", "a", "s", "d"];

export default function ControlsHint({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (WASD.includes(e.key.toLowerCase())) {
        onDismiss();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDismiss]);

  return (
    <div className="absolute inset-0 z-20 flex items-end justify-center pb-24 pointer-events-none">
      <style>{`@keyframes pulse-wasd { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
      <p
        className="text-white text-5xl font-semibold select-none"
        style={{ animation: "pulse-wasd 2s ease-in-out infinite" }}
      >
        Press the WASD keys
      </p>
    </div>
  );
}
