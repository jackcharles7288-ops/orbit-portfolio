import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function Satellite({ planetRadius }) {
  const orbitRef = useRef(null);
  const satRef = useRef(null);
  const scale = planetRadius * 0.11;

  useFrame((_, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y -= delta * 0.45;
    if (satRef.current) satRef.current.rotation.y += delta * 0.6;
  });

  return (
    <group rotation={[0.9, 0.3, 0.2]}>
      <group ref={orbitRef}>
        <group ref={satRef} position={[planetRadius * 1.75, 0, 0]} scale={scale}>
          <mesh>
            <boxGeometry args={[0.9, 0.9, 1.4]} />
            <meshStandardMaterial color="#d8c27a" metalness={0.8} roughness={0.35} />
          </mesh>
          <mesh position={[2.1, 0, 0]}>
            <boxGeometry args={[3.2, 0.05, 1.1]} />
            <meshStandardMaterial
              color="#1a2f6b"
              metalness={0.6}
              roughness={0.25}
              emissive="#0b1a44"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[-2.1, 0, 0]}>
            <boxGeometry args={[3.2, 0.05, 1.1]} />
            <meshStandardMaterial
              color="#1a2f6b"
              metalness={0.6}
              roughness={0.25}
              emissive="#0b1a44"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[0, 0.8, 0.2]} rotation={[-0.6, 0, 0]}>
            <cylinderGeometry args={[0.7, 0.2, 0.3, 24, 1, true]} />
            <meshStandardMaterial
              color="#eeeeee"
              metalness={0.5}
              roughness={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          <pointLight
            color="#ff4040"
            intensity={0.6}
            decay={2}
            distance={3}
            position={[0, -0.6, 0]}
          />
        </group>
      </group>
    </group>
  );
}
