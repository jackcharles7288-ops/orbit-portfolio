import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function Moon({ spec, moonTex }) {
  const pivotRef = useRef(null);
  const meshRef = useRef(null);

  useFrame((_, delta) => {
    if (pivotRef.current) pivotRef.current.rotation.y += spec.speed * delta;
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group rotation={[spec.tilt ?? 0, spec.phase ?? 0, 0]}>
      <group ref={pivotRef} rotation-y={spec.phase ?? 0}>
        <mesh ref={meshRef} position={[spec.distance, 0, 0]} castShadow>
          <sphereGeometry args={[spec.radius, 32, 32]} />
          <meshStandardMaterial
            key={moonTex ? "t" : "p"}
            map={moonTex ?? undefined}
            color={moonTex ? "#ffffff" : spec.color ?? "#bbbbbb"}
            roughness={1}
          />
        </mesh>
      </group>
    </group>
  );
}
