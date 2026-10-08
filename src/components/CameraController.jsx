import * as THREE from "three";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useOrbitStore } from "../store/useOrbitStore";
import { bodyMeshMap } from "../services/textureLoader";
import { sunConfig, projects } from "../data/projects";

const UP_VECTOR = new THREE.Vector3(0, 1, 0);

export function CameraController() {
  const { camera, size } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const targetCamPos = useRef(new THREE.Vector3(0, 60, 190));
  const desiredTarget = useRef(new THREE.Vector3());
  const bodyWorldPos = useRef(new THREE.Vector3());
  const offsetDir = useRef(new THREE.Vector3());
  const crossOffset = useRef(new THREE.Vector3());
  const toBodyDir = useRef(new THREE.Vector3());
  const sideDir = useRef(new THREE.Vector3());
  const isInitialized = useRef(false);
  const zoomScale = useRef(1);

  useFrame((state, delta) => {
    const { phase, current, entered } = useOrbitStore.getState();
    const elapsedTime = state.clock.elapsedTime;
    const isMobileWidth = size.width < 768;
    const aspect = size.width / Math.max(1, size.height);
    const targetScale = Math.max(1, 1.15 / aspect);

    zoomScale.current += (targetScale - zoomScale.current) * Math.min(1, delta * 3);

    if (phase === "intro") {
      const angle = elapsedTime * 0.025;
      targetCamPos.current.set(
        Math.sin(angle) * 195,
        62 + Math.sin(elapsedTime * 0.1) * 4,
        Math.cos(angle) * 195
      );
      desiredTarget.current.set(0, -6, 0);
    } else {
      const activeMesh = bodyMeshMap.get(current);
      if (activeMesh) {
        activeMesh.getWorldPosition(bodyWorldPos.current);
      } else {
        bodyWorldPos.current.set(0, 0, 0);
      }

      const isLandedOrHost = current === 0 || entered;

      if (current === 0) {
        const dist = sunConfig.radius * 4.4 * zoomScale.current;
        offsetDir.current.set(0.55, 0.32, 1).normalize();
        targetCamPos.current
          .copy(bodyWorldPos.current)
          .addScaledVector(offsetDir.current, dist);
      } else {
        const planetSpec = projects[current - 1].planet;
        const radius = planetSpec.radius * (planetSpec.viewScale ?? 1);
        const multiplier = (entered ? 3.1 : 4.6) * zoomScale.current;
        const totalDist = Math.max(radius * multiplier, 7 * zoomScale.current);

        offsetDir.current.copy(bodyWorldPos.current).normalize();
        crossOffset.current
          .crossVectors(UP_VECTOR, offsetDir.current)
          .normalize();

        targetCamPos.current
          .copy(bodyWorldPos.current)
          .addScaledVector(crossOffset.current, totalDist * 0.82)
          .addScaledVector(offsetDir.current, -totalDist * 0.42)
          .addScaledVector(UP_VECTOR, totalDist * 0.3);
      }

      toBodyDir.current.copy(bodyWorldPos.current).sub(targetCamPos.current).normalize();
      sideDir.current.crossVectors(toBodyDir.current, UP_VECTOR).normalize();
      const distanceToBody = targetCamPos.current.distanceTo(bodyWorldPos.current);

      desiredTarget.current.copy(bodyWorldPos.current);
      if (isLandedOrHost) {
        if (isMobileWidth) {
          desiredTarget.current.addScaledVector(UP_VECTOR, -distanceToBody * 0.12);
        } else {
          desiredTarget.current.addScaledVector(sideDir.current, distanceToBody * 0.24);
        }
      }
    }

    if (!isInitialized.current) {
      camera.position.copy(targetCamPos.current);
      currentTarget.current.copy(desiredTarget.current);
      isInitialized.current = true;
    }

    const lerpSpeed = phase === "intro" ? 1.2 : 2;
    const factor = 1 - Math.exp(-delta * lerpSpeed);

    camera.position.lerp(targetCamPos.current, factor);
    currentTarget.current.lerp(desiredTarget.current, factor);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
