import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Trail } from "@react-three/drei";
import { createGlowCanvasTexture } from "./Sun";

export function Comet({ a, b, tilt, speed, phase, color }) {
  const meshRef = useRef(null);
  const glowTexture = useMemo(
    () => createGlowCanvasTexture("rgba(220,240,255,1)", "rgba(150,200,255,0.3)"),
    []
  );

  useFrame((state) => {
    const meanAnomaly = (state.clock.elapsedTime * speed + phase) % (Math.PI * 2);
    const eccentricity = Math.sqrt(1 - (b * b) / (a * a));
    let eccentricAnomaly = meanAnomaly;
    for (let iter = 0; iter < 5; iter++) {
      eccentricAnomaly =
        eccentricAnomaly -
        (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) /
          (1 - eccentricity * Math.cos(eccentricAnomaly));
    }
    const x = a * (Math.cos(eccentricAnomaly) - eccentricity);
    const z = b * Math.sin(eccentricAnomaly);
    if (meshRef.current) {
      meshRef.current.position.set(x, 0, z);
    }
  });

  return (
    <group rotation={tilt}>
      <Trail
        width={2.6}
        length={14}
        color={new THREE.Color(color)}
        attenuation={(p) => p * p}
        decay={1.2}
      >
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.35, 16, 16]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
          <sprite scale={[5, 5, 1]}>
            <spriteMaterial
              map={glowTexture}
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              opacity={0.9}
            />
          </sprite>
        </mesh>
      </Trail>
    </group>
  );
}

export function ShootingStars() {
  return (
    <>
      <Comet a={120} b={40} tilt={[0.35, 0.4, 0.1]} speed={0.16} phase={0.6} color="#9fd6ff" />
      <Comet a={150} b={55} tilt={[-0.5, 2.1, 0.25]} speed={0.11} phase={2.8} color="#c8f2ff" />
      <Comet a={95} b={30} tilt={[0.2, -1.2, -0.4]} speed={0.22} phase={4.5} color="#bfe6ff" />
    </>
  );
}
