import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3, type DirectionalLight, type Mesh } from "three";

let LIGHT_POSITION: Vector3 = new Vector3(5, 10, 5);

export default function LightSetup() {
  const lightRef = useRef<DirectionalLight>(null);
  const { scene } = useThree();
  const shadowSetup = useRef(false);

  useEffect(() => {
    if (!lightRef.current) return;
    const shadow = lightRef.current.shadow;
    shadow.mapSize.set(4096, 4096);
    shadow.bias = -0.001;
    shadow.normalBias = 0.02;
    shadow.camera.left = -15;
    shadow.camera.right = 15;
    shadow.camera.top = 15;
    shadow.camera.bottom = -15;
    shadow.camera.near = 1;
    shadow.camera.far = 50;
    shadow.camera.updateProjectionMatrix();
  }, []);

  useFrame(() => {
    if (shadowSetup.current) return;
    scene.traverse((node) => {
      if ((node as Mesh).isMesh) {
        const mesh = node as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    shadowSetup.current = true;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        ref={lightRef}
        position={LIGHT_POSITION}
        color="#f9d99c"
        castShadow
      />
    </>
  );
}
