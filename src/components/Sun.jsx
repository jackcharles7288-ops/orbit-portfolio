import * as THREE from "three";
import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { TEXTURES } from "../data/textures";
import { sunConfig } from "../data/projects";
import { useTexture, bodyMeshMap } from "../services/textureLoader";

export function createSunAtmosphereMaterial(color = "#ff9a3c", intensity = 1.6, power = 1.6) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: intensity },
      uPower: { value: power },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform float uPower;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float d = -dot(normalize(vNormal), normalize(vViewDir));
        float glow = pow(clamp(d * 2.2, 0.0, 1.0), uPower) * uIntensity;
        gl_FragColor = vec4(uColor * glow, glow);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

export function createGlowCanvasTexture(
  inner = "rgba(255,225,170,1)",
  outer = "rgba(255,150,60,0.35)"
) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(0.18, inner);
  gradient.addColorStop(0.4, outer);
  gradient.addColorStop(1, "rgba(255,120,40,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createSunSurfaceMaterial(texture) {
  if (texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  }
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uHasMap: { value: texture ? 1 : 0 },
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      uniform sampler2D uMap;
      uniform float uHasMap;
      uniform float uTime;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vec2 uv1 = vUv + vec2(uTime * 0.003, 0.0);
        vec2 uv2 = vUv * 1.15 + vec2(-uTime * 0.0035, uTime * 0.001);
        vec3 a = uHasMap > 0.5 ? texture2D(uMap, uv1).rgb : vec3(1.0, 0.55, 0.15);
        vec3 b = uHasMap > 0.5 ? texture2D(uMap, uv2).rgb : vec3(1.0, 0.6, 0.2);
        vec3 col = mix(a, b, 0.12) * 1.08;
        float rim = 1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
        col += vec3(1.0, 0.45, 0.1) * pow(rim, 4.0) * 0.45;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    toneMapped: false,
  });
}

export function Sun({ lowSpec = false }) {
  const groupRef = useRef(null);
  const meshRef = useRef(null);
  const texture = useTexture(TEXTURES.sun);

  const surfaceMaterial = useMemo(() => createSunSurfaceMaterial(texture), [texture]);
  const atmosphereMaterial = useMemo(() => createSunAtmosphereMaterial("#ff9a3c", 1.6, 1.6), []);
  const glowTexture = useMemo(() => createGlowCanvasTexture(), []);

  useEffect(() => {
    bodyMeshMap.set(0, groupRef.current);
    return () => {
      bodyMeshMap.delete(0);
    };
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += sunConfig.spin * delta;
    }
    if (surfaceMaterial) {
      surfaceMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const segs = lowSpec ? 48 : 96;
  const atmSegs = lowSpec ? 32 : 64;

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef} material={surfaceMaterial}>
        <sphereGeometry args={[sunConfig.radius, segs, segs]} />
      </mesh>
      <mesh material={atmosphereMaterial} scale={1.16}>
        <sphereGeometry args={[sunConfig.radius, atmSegs, atmSegs]} />
      </mesh>
      <sprite scale={[sunConfig.radius * 5.2, sunConfig.radius * 5.2, 1]}>
        <spriteMaterial
          map={glowTexture}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.85}
          toneMapped={false}
        />
      </sprite>
      <pointLight intensity={2.6} decay={0} color="#fff3e0" />
    </group>
  );
}
