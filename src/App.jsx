import React, { useEffect } from "react";
import { useOrbitStore } from "./store/useOrbitStore";
import { preloadAllTextures } from "./services/textureLoader";
import { projects } from "./data/projects";
import { Scene } from "./components/Scene";
import { IntroScreen } from "./components/IntroScreen";
import { OrbitHUD } from "./components/OrbitHUD";

export default function App() {
  const setTotal = useOrbitStore((s) => s.setTotal);

  useEffect(() => {
    setTotal(projects.length);
    preloadAllTextures();
  }, [setTotal]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#02030a] text-white">
      <Scene />
      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />
      <IntroScreen />
      <OrbitHUD />
    </div>
  );
}
