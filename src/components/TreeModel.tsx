import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useRef } from "react";
import { type Group } from "three";

const MODEL_URL = "/Forest.glb";

function Model() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_URL);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1} />
    </group>
  );
}

export default function TreeModel() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 5, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 0, 1]} />
        <Model />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
