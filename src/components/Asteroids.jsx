import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { TEXTURES } from "../data/textures";
import { useTexture } from "../services/textureLoader";

function computeSphericalUVs(geometry) {
  const pos = geometry.attributes.position;
  const uvs = new Float32Array(pos.count * 2);
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i).normalize();
    uvs[i * 2] = 0.5 + Math.atan2(v.z, v.x) / (Math.PI * 2);
    uvs[i * 2 + 1] = 0.5 - Math.asin(v.y) / Math.PI;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
  return geometry;
}

export function Asteroids({
  inner = 57,
  outer = 63,
  count = 1400,
  lowSpec = false,
}) {
  const instancedRef = useRef(null);
  const groupRef = useRef(null);
  const texture = useTexture(TEXTURES.ceres);

  const geometry = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(1, lowSpec ? 1 : 2);
    const pos = geom.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      v.multiplyScalar(0.72 + Math.random() * 0.56);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geom.computeVertexNormals();
    computeSphericalUVs(geom);
    return geom;
  }, [lowSpec]);

  useEffect(() => {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const dist = inner + Math.pow(Math.random(), 0.7) * (outer - inner);
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 1.8;
      dummy.position.set(Math.cos(angle) * dist, height, Math.sin(angle) * dist);
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      const scale = 0.06 + Math.pow(Math.random(), 3) * 0.55;
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      if (instancedRef.current) {
        instancedRef.current.setMatrixAt(i, dummy.matrix);
      }
    }
    if (instancedRef.current) {
      instancedRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [count, inner, outer]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.004;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={instancedRef}
        args={[geometry, undefined, count]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          key={texture ? "t" : "p"}
          map={texture ?? undefined}
          color={texture ? "#ffffff" : "#8a7d6e"}
          roughness={1}
          metalness={0.05}
        />
      </instancedMesh>
    </group>
  );
}
