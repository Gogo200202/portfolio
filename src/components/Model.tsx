import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { MathUtils, type Group, type Mesh } from "three";

const MODEL_URL = `${import.meta.env.BASE_URL}Forest.glb`;

interface Target {
  mesh: Mesh;
  origPos: Float32Array;
  offsetX: number;
  dir: number;
}

export default function Model() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const targetsRef = useRef<Target[]>([]);
  const timeRef = useRef(0);
  const { camera } = useThree();
  const [zoom, setZoom] = useState(0);
  const mouse = useRef({ x: 0, y: 0 });
  const angles = useRef({ theta: 0, phi: 0 });

  const CENTER_Y = 1.5;

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      setZoom((prev) => MathUtils.clamp(prev + e.deltaY * 0.01, 3, 15));
    };
    window.addEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const objects: Target[] = [];
    scene.traverse((node) => {
      if ((node as Mesh).isMesh) {
        const mesh = node as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        const mat = Array.isArray(mesh.material)
          ? mesh.material[0]
          : mesh.material;
        if (mat?.name === "mat11" || mat?.name === "mat10") {
          if (mesh.name === "mesh2009401224") {
            return;
          }
          const geo = mesh.geometry.clone();
          mesh.geometry = geo;
          const orig = new Float32Array(geo.attributes.position.array);
          objects.push({
            mesh,
            origPos: orig,
            offsetX: Math.floor(Math.random() * 10),
            dir: Math.floor(Math.random() * 10) < 0.5 ? 1 : -1,
          } as Target);
        }
      }
    });
    targetsRef.current = objects;
  }, [scene]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    const targetTheta = mouse.current.x * 0.4;
    const targetPhi = mouse.current.y * 0.12;

    angles.current.theta += (targetTheta - angles.current.theta) * 0.05;
    angles.current.phi += (targetPhi - angles.current.phi) * 0.05;

    const dist = zoom;
    const { theta, phi } = angles.current;

    camera.position.x = dist * Math.sin(theta) * Math.cos(phi);
    camera.position.y = CENTER_Y + dist * Math.sin(phi);
    camera.position.z = dist * Math.cos(theta) * Math.cos(phi);
    camera.lookAt(0, CENTER_Y, 0);

    for (const { mesh, origPos, offsetX, dir } of targetsRef.current) {
      const pos = mesh.geometry.attributes.position.array;

      for (let i = 0; i < pos.length; i += 3) {
        const y = origPos[i + 1];
        const d = Math.sin(t * 2 + y * 0.5 + offsetX) * 0.005 * (y + 1);
        pos[i + 2] = origPos[i + 2] + d * 0.8;
      }
      mesh.geometry.attributes.position.needsUpdate = true;

      mesh.rotation.z = Math.sin(t + 1) * 0.01 * dir;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}
