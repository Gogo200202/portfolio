import { useEffect, useRef } from "react";
import { Vector3, type DirectionalLight } from "three";

let LIGHT_POSITION: Vector3 = new Vector3(5, 10, 5);

export default function LightSetup() {
  const lightRef = useRef<DirectionalLight>(null);

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
