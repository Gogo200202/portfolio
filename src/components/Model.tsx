import { useGLTF } from "@react-three/drei";

const MODEL_URL = `${import.meta.env.BASE_URL}Forest.glb`;

export default function Model() {
  const { scene } = useGLTF(MODEL_URL);
  return <primitive object={scene} />;
}
