import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  ContactShadows,
  MeshDistortMaterial,
  RoundedBox,
  OrbitControls,
} from "@react-three/drei";
import CanvasLoader from "./CanvasLoader";

function Knot() {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.25;
      ref.current.rotation.z += delta * 0.08;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.1}>
      <mesh ref={ref} castShadow scale={1.25}>
        <torusKnotGeometry args={[0.9, 0.28, 220, 32]} />
        <MeshDistortMaterial
          color="#fdeb07"
          emissive="#a89a00"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.6}
          distort={0.3}
          speed={1.6}
        />
      </mesh>
    </Float>
  );
}

function Package({ position, color, scale = 1, rotation = [0, 0, 0] }) {
  return (
    <Float speed={2} rotationIntensity={1.2} floatIntensity={1.6}>
      <RoundedBox
        args={[1, 1, 1]}
        radius={0.14}
        smoothness={4}
        position={position}
        rotation={rotation}
        scale={scale}
        castShadow
      >
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={0.12}
        />
      </RoundedBox>
    </Float>
  );
}

function SceneContents() {
  const group = useRef();
  const packages = useMemo(
    () => [
      { position: [2.4, 1.1, -0.5], color: "#fdeb07", scale: 0.55, rotation: [0.4, 0.6, 0.2] },
      { position: [-2.6, 0.6, -0.3], color: "#c9b800", scale: 0.7, rotation: [0.2, 0.8, 0.5] },
      { position: [1.9, -1.3, 0.4], color: "#ff5c35", scale: 0.45, rotation: [0.6, 0.2, 0.3] },
      { position: [-2.1, -1.2, 0.2], color: "#e6d500", scale: 0.5, rotation: [0.1, 0.4, 0.7] },
    ],
    []
  );

  useFrame((state) => {
    if (group.current) {
      const t = state.clock.getElapsedTime();
      group.current.rotation.y = Math.sin(t * 0.15) * 0.25;
    }
  });

  return (
    <group ref={group}>
      <ambientLight intensity={0.7} />
      <hemisphereLight intensity={0.5} groundColor="#0a0c0a" color="#fff4a8" />
      <pointLight position={[5, 5, 5]} intensity={80} color="#fdeb07" />
      <pointLight position={[-5, -3, 2]} intensity={60} color="#c9b800" />
      <pointLight position={[0, 3, -4]} intensity={40} color="#ff5c35" />
      <spotLight position={[0, 6, 3]} angle={0.4} intensity={30} penumbra={1} castShadow />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />

      <Knot />
      {packages.map((p, i) => (
        <Package key={i} {...p} />
      ))}

      <ContactShadows position={[0, -2.1, 0]} opacity={0.35} scale={12} blur={2.6} far={4} color="#020617" />
    </group>
  );
}

const HeroScene = () => {
  const lowPerf =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 768px)").matches;

  return (
    <Canvas
      shadows
      dpr={lowPerf ? [1, 1] : [1, 2]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <SceneContents />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={lowPerf}
        autoRotateSpeed={0.8}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 2.6}
      />
    </Canvas>
  );
};

export default HeroScene;
