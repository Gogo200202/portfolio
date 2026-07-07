import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";

export default function Loader() {
  const { progress } = useProgress();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  if (!show) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
      <style>{`@keyframes pulse-svg { 0%,100% { transform: scale(1); } 50% { transform: scale(1.2); } }`}</style>
      <img
        src={`${import.meta.env.BASE_URL}walk.svg`}
        alt="loading"
        className="w-32 h-32 invert"
        style={{ animation: "pulse-svg 1.2s ease-in-out infinite" }}
      />
    </div>
  );
}
