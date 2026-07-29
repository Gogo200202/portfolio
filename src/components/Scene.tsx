import { Canvas } from "@react-three/fiber";
import Adventurer from "./Adventurer";
import LightSetup from "./LightSetup";
import Model from "./Model";

export default function Scene() {
  return (
    <div className="w-full h-screen">
      <Canvas shadows camera={{ position: [0, 2, 10] }}>
        <color attach="background" args={["skyblue"]} />
        <LightSetup />
        <Model />
        <Adventurer />
      </Canvas>
    </div>
  );
}
