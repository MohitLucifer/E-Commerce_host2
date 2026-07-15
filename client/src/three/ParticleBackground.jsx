import React, { useMemo, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as THREE from "three";

function randomInSphere(count, radius) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // rejection sampling for a uniform-ish distribution inside a sphere
    let x, y, z, d2;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
      d2 = x * x + y * y + z * z;
    } while (d2 > 1 || d2 === 0);
    arr[i * 3] = x * radius;
    arr[i * 3 + 1] = y * radius;
    arr[i * 3 + 2] = z * radius;
  }
  return arr;
}

function StarField({ count = 2400 }) {
  const teal = useRef();
  const indigo = useRef();
  const tealPositions = useMemo(() => randomInSphere(count, 1.4), [count]);
  const indigoPositions = useMemo(() => randomInSphere(Math.floor(count / 2), 1.7), [count]);

  useFrame((_, delta) => {
    if (teal.current) {
      teal.current.rotation.x -= delta / 22;
      teal.current.rotation.y -= delta / 30;
    }
    if (indigo.current) {
      indigo.current.rotation.x += delta / 34;
      indigo.current.rotation.y += delta / 26;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 5]}>
      <Points ref={teal} positions={tealPositions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#fdeb07"
          size={0.006}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <Points ref={indigo} positions={indigoPositions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#c9b800"
          size={0.008}
          sizeAttenuation
          depthWrite={false}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

const ParticleBackground = () => {
  // Respect reduced-motion / very small screens: skip the WebGL layer entirely.
  const disabled =
    typeof window !== "undefined" &&
    (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 600px)").matches);

  if (disabled) return null;

  return (
    <div className="bg-canvas" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: false }}>
        <Suspense fallback={null}>
          <StarField />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;
