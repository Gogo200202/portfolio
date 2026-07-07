import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Vector3 } from "three";
import LightSetup from "./LightSetup";
import Loader from "./Loader";
import Model from "./Model";

let CAMERA_POSITION: Vector3 = new Vector3(0, 2, 10);

export default function TreeModel() {
  return (
    <div className="w-full h-screen relative">
      <Canvas shadows camera={{ position: CAMERA_POSITION }}>
        <color attach="background" args={["skyblue"]} />

        <LightSetup />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
