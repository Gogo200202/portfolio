import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useRef } from "react";
import { type Group, type Mesh } from "three";

const MODEL_URL = "/Forest.glb";

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

  useEffect(() => {
    const objects: Target[] = [];
    scene.traverse((node) => {
      if ((node as Mesh).isMesh) {
        const mesh = node as Mesh;
        const mat = Array.isArray(mesh.material)
          ? mesh.material[0]
          : mesh.material;
        if (
          mat?.name === "mat10" ||
          (mat?.name === "mat11" && mesh.name !== "mesh2009401224")
        ) {
          const geo = mesh.geometry.clone();
          mesh.geometry = geo;
          const orig = new Float32Array(geo.attributes.position.array);
          objects.push({
            mesh,
            origPos: orig,
            offsetX: mesh.position.x,
            dir: Math.random() < 0.5 ? 1 : -1,
          });
        }
      }
    });
    targetsRef.current = objects;
  }, [scene]);

  useFrame((_, delta) => {B
    timeRef.current += delta;
    const t = timeRef.current;

    for (const { mesh, origPos, offsetX, dir } of targetsRef.current) {
      const pos = mesh.geometry.attributes.position.array;

      for (let i = 0; i < pos.length; i += 3) {
        const y = origPos[i + 1];
        const d = Math.sin(t * 2 + y * 0.5 + offsetX) * 0.005 * (y + 1);
        pos[i] = origPos[i] + d;
        pos[i + 2] = origPos[i + 2] + d * 0.5;
      }
      mesh.geometry.attributes.position.needsUpdate = true;

      mesh.rotation.z = Math.sin(t + 1) * 0.01 * dir;
    }
  });

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
