import { useProgress } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Adventurer from "./Adventurer";
import ControlsHint from "./ControlsHint";
import LightSetup from "./LightSetup";
import Loader from "./Loader";
import Model from "./Model";

export default function Scene() {
  const { progress } = useProgress();
  const [ready, setReady] = useState(false);
  const [hintDone, setHintDone] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => setReady(true), 500);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  return (
    <div className="relative w-full h-screen">
      {!ready && <Loader />}
      {ready && !hintDone && (
        <ControlsHint onDismiss={() => setHintDone(true)} />
      )}
      <Canvas shadows>
        <color attach="background" args={["skyblue"]} />
        <LightSetup />
        <Model />
        <Adventurer />
      </Canvas>
    </div>
  );
}
