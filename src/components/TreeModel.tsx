import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import { Vector3, type Group, type Mesh } from "three";
import LightSetup from "./LightSetup";

const MODEL_URL = "/Forest.glb";
let CAMERA_POSITION: Vector3 = new Vector3(0, 2, 10);


interface Target {
  mesh: Mesh;
  origPos: Float32Array;
  offsetX: number;
  dir: number;
}

function Model() {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const targetsRef = useRef<Target[]>([]);
  const timeRef = useRef(0);
  const { camera } = useThree();
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      setZoom((prev) => Math.min(10, prev + e.deltaY * 0.01));
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

    camera.position.z += (zoom - camera.position.z) * 0.08;

    for (const { mesh, origPos, offsetX, dir } of targetsRef.current) {
      const pos = mesh.geometry.attributes.position.array;

      for (let i = 0; i < pos.length; i += 3) {
        const y = origPos[i + 1];
        const d = Math.sin(t * 2 + y * 0.5 + offsetX) * 0.005 * (y + 1);
        //pos[i] = origPos[i] + d;
        //pos[i + 1] = origPos[i + 1] + d * 0.5;
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

export default function TreeModel() {
  return (
    <div className="w-full h-screen">
      <Canvas shadows camera={{ position: CAMERA_POSITION }}>
        <color attach="background" args={["skyblue"]} />

        <LightSetup />
        <Model />
        {/* <OrbitControls /> */}
      </Canvas>
    </div>
  );
}
