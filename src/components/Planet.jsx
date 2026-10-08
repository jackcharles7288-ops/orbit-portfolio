import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Moon } from "./Moon";
import { Satellite } from "./Satellite";
import { createSunAtmosphereMaterial } from "./Sun";
import { useTexture, bodyMeshMap } from "../services/textureLoader";
import { TEXTURES } from "../data/textures";
import { useOrbitStore } from "../store/useOrbitStore";

export function createRingGeometry(inner, outer, lowSpec = false) {
  const geom = new THREE.RingGeometry(inner, outer, lowSpec ? 96 : 160, 1);
  const pos = geom.attributes.position;
  const uv = geom.attributes.uv;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const len = v.length();
    uv.setXY(i, (len - inner) / (outer - inner), 0.5);
  }
  uv.needsUpdate = true;
  return geom;
}

export function createPlanetMaterial(map, nightMap, fallbackColor) {
  const mat = new THREE.MeshStandardMaterial({
    map: map ?? undefined,
    color: map ? "#ffffff" : fallbackColor,
    roughness: 0.9,
    metalness: 0.02,
    emissive: nightMap ? new THREE.Color("#ffd9a0") : new THREE.Color("#000000"),
    emissiveMap: nightMap ?? undefined,
    emissiveIntensity: nightMap ? 1.4 : 0,
  });

  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
varying float vSunDot;`
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
vec4 wpEmit = modelMatrix * vec4(transformed, 1.0);
vec3 wnEmit = normalize(mat3(modelMatrix) * objectNormal);
vSunDot = dot(wnEmit, normalize(-wpEmit.xyz));`
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
varying float vSunDot;`
      )
      .replace(
        "#include <emissivemap_fragment>",
        `#include <emissivemap_fragment>
totalEmissiveRadiance *= 1.0 - smoothstep(-0.25, 0.1, vSunDot);`
      );
  };

  return mat;
}

export function Planet({ project, index, lowSpec = false }) {
  const p = project.planet;
  const orbitGroupRef = useRef(null);
  const planetMeshRef = useRef(null);
  const cloudsMeshRef = useRef(null);
  const ringMeshRef = useRef(null);

  const texture = useTexture(p.texture);
  const nightTexture = useTexture(p.night);
  const cloudsTexture = useTexture(p.clouds, true);
  const ringTexture = useTexture(p.rings?.texture);
  const moonTexture = useTexture(p.moons?.length ? TEXTURES.moon : undefined);

  const phase = useOrbitStore((s) => s.phase);
  const go = useOrbitStore((s) => s.go);
  const setPhase = useOrbitStore((s) => s.setPhase);

  const planetMaterial = useMemo(
    () => createPlanetMaterial(texture, nightTexture, p.fallbackColor),
    [texture, nightTexture, p.fallbackColor]
  );

  const atmosphereMaterial = useMemo(
    () =>
      p.atmosphere
        ? createSunAtmosphereMaterial(p.atmosphere.color, p.atmosphere.intensity)
        : null,
    [p.atmosphere]
  );

  const ringGeometry = useMemo(
    () =>
      p.rings
        ? createRingGeometry(
            (p.rings.inner ?? 1) * p.radius,
            (p.rings.outer ?? 2) * p.radius,
            lowSpec
          )
        : null,
    [p.rings, p.radius, lowSpec]
  );

  useEffect(() => {
    bodyMeshMap.set(index, orbitGroupRef.current);
    return () => {
      bodyMeshMap.delete(index);
    };
  }, [index]);

  useFrame((state, delta) => {
    const angle = p.angle0 + state.clock.elapsedTime * p.speed;
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.set(
        Math.cos(angle) * p.orbit,
        0,
        Math.sin(angle) * p.orbit
      );
    }
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += p.spin * delta;
    }
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.rotation.y += p.spin * 1.25 * delta;
    }
  });

  const segs = p.radius > 3 ? (lowSpec ? 64 : 96) : lowSpec ? 40 : 64;

  return (
    <>
      <mesh rotation-x={-Math.PI / 2}>
        <ringGeometry args={[p.orbit - 0.06, p.orbit + 0.06, 256]} />
        <meshBasicMaterial
          color="#8fb3ff"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <group ref={orbitGroupRef}>
        <group rotation-z={p.tilt}>
          <mesh
            ref={planetMeshRef}
            material={planetMaterial}
            castShadow
            receiveShadow
          >
            <sphereGeometry args={[p.radius, segs, segs]} />
          </mesh>

          {cloudsTexture && (
            <mesh ref={cloudsMeshRef} scale={1.012}>
              <sphereGeometry args={[p.radius, segs, segs]} />
              <meshStandardMaterial
                alphaMap={cloudsTexture}
                color="#ffffff"
                transparent
                opacity={0.9}
                depthWrite={false}
                roughness={1}
              />
            </mesh>
          )}

          {atmosphereMaterial && p.atmosphere && (
            <mesh material={atmosphereMaterial} scale={p.atmosphere.scale}>
              <sphereGeometry args={[p.radius, lowSpec ? 32 : 64, lowSpec ? 32 : 64]} />
            </mesh>
          )}

          {p.rings && (
            <mesh
              ref={ringMeshRef}
              geometry={ringGeometry}
              rotation-x={-Math.PI / 2}
              receiveShadow
            >
              <meshStandardMaterial
                key={ringTexture ? "t" : "p"}
                map={ringTexture ?? undefined}
                color={ringTexture ? "#ffffff" : "#c9b48a"}
                transparent
                opacity={ringTexture ? 1 : 0.6}
                side={THREE.DoubleSide}
                depthWrite={false}
                roughness={0.85}
              />
            </mesh>
          )}
        </group>

        {p.moons?.map((moonSpec, idx) => (
          <Moon key={idx} spec={moonSpec} moonTex={moonTexture} />
        ))}

        {p.satellite && <Satellite planetRadius={p.radius} />}

        <Html
          center
          position={[0, p.radius * (p.rings ? 2.4 : 1.6) + 1.5, 0]}
          zIndexRange={[5, 0]}
          style={{
            opacity: phase === "intro" ? 1 : 0,
            transition: "opacity .6s ease",
            pointerEvents: phase === "intro" ? "auto" : "none",
          }}
        >
          <button
            onClick={() => {
              go(index);
              setPhase("orbit");
            }}
            className="group flex flex-col items-center gap-1 whitespace-nowrap font-mono text-[10px] tracking-[0.3em] uppercase text-white/70 hover:text-white transition"
          >
            <span className="h-6 w-px bg-gradient-to-b from-transparent to-white/50" />
            <span style={{ color: project.accent }}>{project.name}</span>
          </button>
        </Html>
      </group>
    </>
  );
}
