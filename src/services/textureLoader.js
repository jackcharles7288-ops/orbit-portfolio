import * as THREE from "three";
import { useEffect, useState } from "react";
import { ALL_TEXTURE_URLS } from "../data/textures";
import { useOrbitStore } from "../store/useOrbitStore";

export const isMobile =
  typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

const textureLoader = new THREE.TextureLoader();
textureLoader.setCrossOrigin("anonymous");

const textureCache = new Map();

function resizeImage(image, maxSize) {
  const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);
  return canvas;
}

export function loadTexture(url, linear = false) {
  const cacheKey = linear ? `lin:${url}` : url;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const promise = new Promise((resolve) => {
    let resolved = false;
    const finish = (tex) => {
      if (!resolved) {
        resolved = true;
        resolve(tex);
      }
    };

    window.setTimeout(() => finish(null), 25000);

    textureLoader.load(
      url,
      (tex) => {
        if (!resolved) {
          if (
            isMobile &&
            tex.image instanceof HTMLImageElement &&
            Math.max(tex.image.width, tex.image.height) > 2048
          ) {
            tex.image = resizeImage(tex.image, 2048);
          }
          tex.colorSpace = linear ? THREE.LinearSRGBColorSpace : THREE.SRGBColorSpace;
          tex.anisotropy = isMobile ? 4 : 8;
          tex.needsUpdate = true;
          finish(tex);
        }
      },
      undefined,
      () => {
        console.warn("Texture failed to load:", url);
        finish(null);
      }
    );
  }).finally(() => {
    const state = useOrbitStore.getState();
    if (state.gateTotal > 0 && state.gated < state.gateTotal) {
      state.gateDone();
    }
    if (!linear) {
      state.assetDone();
    }
  });

  textureCache.set(cacheKey, promise);
  return promise;
}

const GATE_REQUIRED_COUNT = 2;

export function preloadAllTextures() {
  const state = useOrbitStore.getState();
  state.setAssetsTotal(ALL_TEXTURE_URLS.length);
  state.setGateTotal(GATE_REQUIRED_COUNT);

  ALL_TEXTURE_URLS.forEach((url) => loadTexture(url));

  window.setTimeout(() => {
    const s = useOrbitStore.getState();
    if (s.gated < s.gateTotal) {
      s.setGateTotal(s.gated);
    }
  }, 4000);
}

export function useTexture(url, linear = false) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!url) return;
    let active = true;
    loadTexture(url, linear).then((loaded) => {
      if (active) setTexture(loaded);
    });
    return () => {
      active = false;
    };
  }, [url, linear]);

  return texture;
}

// Global registry for 3D body positions/mesh references (0 = Sun, 1..6 = planets)
export const bodyMeshMap = new Map();
