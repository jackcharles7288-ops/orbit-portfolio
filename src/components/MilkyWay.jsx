import * as THREE from "three";
import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { TEXTURES } from "../data/textures";
import { useTexture } from "../services/textureLoader";

export function MilkyWay({ starCount = 5000 }) {
  const texture = useTexture(TEXTURES.milkyWay);
  const { scene } = useThree();

  useEffect(() => {
    if (!texture) {
      scene.background = new THREE.Color("#02030a");
      return;
    }
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = THREE.SRGBColorSpace;
    scene.background = texture;
    scene.backgroundIntensity = 0.55;
    scene.backgroundRotation = new THREE.Euler(0.6, 1.2, 0.25);
  }, [texture, scene]);

  return (
    <Stars
      radius={260}
      depth={80}
      count={starCount}
      factor={3.5}
      saturation={0.2}
      fade={true}
      speed={0.4}
    />
  );
}
