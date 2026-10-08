import * as THREE from "three";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { MilkyWay } from "./MilkyWay";
import { Sun } from "./Sun";
import { Planet } from "./Planet";
import { Asteroids } from "./Asteroids";
import { ShootingStars } from "./ShootingStars";
import { CameraController } from "./CameraController";
import { projects } from "../data/projects";
import { isMobile } from "../services/textureLoader";

export function Scene() {
  return (
    <Canvas
      className="!fixed inset-0"
      camera={{ position: [0, 60, 190], fov: 45, near: 0.1, far: 2000 }}
      dpr={[1, isMobile ? 1.3 : 1.75]}
      performance={{ min: 0.6 }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
    >
      <color attach="background" args={["#02030a"]} />
      <ambientLight intensity={0.06} />
      <hemisphereLight intensity={0.04} color="#8fb3ff" groundColor="#000000" />
      <MilkyWay starCount={isMobile ? 2200 : 5000} />
      <Sun lowSpec={isMobile} />
      {projects.map((p, idx) => (
        <Planet key={p.id} project={p} index={idx + 1} lowSpec={isMobile} />
      ))}
      <Asteroids count={isMobile ? 600 : 1400} lowSpec={isMobile} />
      <ShootingStars />
      <CameraController />
    </Canvas>
  );
}
