import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { type Group, Raycaster, Vector3 } from "three";

const MODEL_URL = `${import.meta.env.BASE_URL}Adventurer.glb`;
const SPEED = 3;

const keyState: Record<string, boolean> = {};

export default function Adventurer() {
  const { scene } = useGLTF(MODEL_URL);
  const ref = useRef<Group>(null);
  const { camera, scene: r3fScene } = useThree();
  const raycaster = useRef(new Raycaster());

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keyState[e.key.toLowerCase()] = true;
    };
    const up = (e: KeyboardEvent) => {
      keyState[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    const forward = new Vector3();
    const right = new Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, new Vector3(0, 1, 0)).normalize();

    const dir = new Vector3();
    if (keyState["w"]) dir.add(forward);
    if (keyState["s"]) dir.sub(forward);
    if (keyState["a"]) dir.sub(right);
    if (keyState["d"]) dir.add(right);

    if (dir.lengthSq() > 0) {
      dir.normalize().multiplyScalar(SPEED * delta);
      if (ref.current) ref.current.position.add(dir);
    }

    if (ref.current) {
      const origin = ref.current.position.clone();
      origin.y += 5;
      raycaster.current.set(origin, new Vector3(0, -1, 0));
      const intersects = raycaster.current.intersectObjects(r3fScene.children, true);
      for (const hit of intersects) {
        let obj = hit.object;
        let isSelf = false;
        while (obj.parent) {
          if (obj === ref.current) { isSelf = true; break; }
          obj = obj.parent;
        }
        if (!isSelf) {
          ref.current.position.y = hit.point.y;
          break;
        }
      }

      const offset = new Vector3(1, 2, 2);
      const targetPos = ref.current.position.clone().add(offset);
      camera.position.lerp(targetPos, 0.08);
      camera.lookAt(ref.current.position);
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[0, 0.5, 8]}
      rotation={[0, Math.PI, 0]}
    />
  );
}
