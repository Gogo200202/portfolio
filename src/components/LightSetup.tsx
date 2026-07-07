import { useEffect, useRef } from "react";
import { Vector3, type DirectionalLight } from "three";

let LIGHT_POSITION: Vector3 = new Vector3(5, 10, 5);
let AMBIENT_INTENSITY = 0.6;

export default function LightSetup() {
  const lightRef = useRef<DirectionalLight>(null);

  useEffect(() => {
    if (!lightRef.current) return;
    const shadow = lightRef.current.shadow;
    shadow.mapSize.set(2048, 2048);
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
      <directionalLight
        ref={lightRef}
        position={LIGHT_POSITION}
        color="#f9d99c"
        castShadow
      />
      <ambientLight intensity={AMBIENT_INTENSITY} />
    </>
  );
}
