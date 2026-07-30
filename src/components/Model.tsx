import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { type Mesh } from "three";

const MODEL_URL = `${import.meta.env.BASE_URL}Forest.glb`;

export default function Model() {
  const { scene } = useGLTF(MODEL_URL);

  useEffect(() => {
    scene.traverse((node) => {
      if ((node as Mesh).isMesh) {
        const mesh = node as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}
