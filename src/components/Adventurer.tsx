import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import {
  AnimationMixer,
  type AnimationAction,
  type Group,
  Raycaster,
  Vector3,
} from "three";

const MODEL_URL = `${import.meta.env.BASE_URL}Adventurer.glb`;
const SPEED = 3;
const Z_MIN = -11.5;
const Z_MAX = 7.1;
const COLLISION_DISTANCE = 0.5;

const keyState: Record<string, boolean> = {};

export default function Adventurer() {
  const { scene, animations } = useGLTF(MODEL_URL);
  const ref = useRef<Group>(null);
  const { camera, scene: r3fScene } = useThree();
  const raycaster = useRef(new Raycaster());
  const collisionRaycaster = useRef(new Raycaster());
  const mixerRef = useRef<AnimationMixer | null>(null);
  const idleActionRef = useRef<AnimationAction | null>(null);
  const walkActionRef = useRef<AnimationAction | null>(null);
  const waveActionRef = useRef<AnimationAction | null>(null);
  const isMoving = useRef(false);
  const lastLoggedPos = useRef("");

  useEffect(() => {
    if (!ref.current) return;
    const mixer = new AnimationMixer(ref.current);
    mixerRef.current = mixer;

    const idleClip = animations.find(
      (a) => a.name === "CharacterArmature|Idle",
    );
    const walkClip = animations.find(
      (a) => a.name === "CharacterArmature|Walk",
    );
    const waveClip = animations.find(
      (a) => a.name === "CharacterArmature|Wave",
    );

    if (idleClip) idleActionRef.current = mixer.clipAction(idleClip);
    if (walkClip) walkActionRef.current = mixer.clipAction(walkClip);

    if (waveClip) {
      const wave = mixer.clipAction(waveClip);
      wave.reset().play();
      waveActionRef.current = wave;
    }
  }, [ref.current, animations]);

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
    mixerRef.current?.update(delta);

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

    const moving = dir.lengthSq() > 0;

    if (moving && ref.current) {
      ref.current.rotation.y = Math.atan2(dir.x, dir.z) + Math.PI;
      const deltaVec = dir.normalize().multiplyScalar(SPEED * delta);
      const nextPos = ref.current.position.clone().add(deltaVec);

      const origin = ref.current.position.clone();
      origin.y += 0.5;
      collisionRaycaster.current.set(origin, deltaVec.clone().normalize());
      collisionRaycaster.current.far = COLLISION_DISTANCE;
      const hits = collisionRaycaster.current.intersectObjects(
        r3fScene.children,
        true,
      );
      const blocked = hits.some(
        (h) =>
          h.object.name !== "mesh2009401224_1" && h.object.name !== "Box001_1",
      );

      if (!blocked && nextPos.z >= Z_MIN && nextPos.z <= Z_MAX) {
        ref.current.position.copy(nextPos);
      }
    }

    if (moving !== isMoving.current) {
      isMoving.current = moving;
      const wave = waveActionRef.current;
      const idle = idleActionRef.current;
      const walk = walkActionRef.current;
      if (wave) {
        wave.fadeOut(0.2);
        waveActionRef.current = null;
      }
      if (walk) {
        if (moving) {
          idle?.fadeOut(0.2);
          walk.reset().fadeIn(0.2).play();
        } else {
          walk.fadeOut(0.2);
        }
      }
    }
    // camera
    if (ref.current) {
      const posKey = ref.current.position
        .toArray()
        .map((v) => v.toFixed(3))
        .join(",");
      if (posKey !== lastLoggedPos.current) {
        lastLoggedPos.current = posKey;
        console.log(
          "Character position:",
          ref.current.position.toArray().map((v) => +v.toFixed(3)),
        );
      }

      const origin = ref.current.position.clone();
      origin.y += 5;
      raycaster.current.set(origin, new Vector3(0, -1, 0));
      const intersects = raycaster.current.intersectObjects(
        r3fScene.children,
        true,
      );
      for (const hit of intersects) {
        if (
          hit.object.name === "mesh2009401224_1" ||
          hit.object.name === "Box001_1"
        ) {
          ref.current.position.y = hit.point.y;
          break;
        }
      }

      const offset = new Vector3(0, 2, 2.5);
      const targetPos = ref.current.position.clone().add(offset);
      camera.position.lerp(targetPos, 1);
      camera.lookAt(ref.current.position);
    }
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      position={[0, 0.5, 7.0]}
      rotation={[0, Math.PI, 0]}
    />
  );
}
