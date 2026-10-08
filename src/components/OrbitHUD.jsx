import React, { useEffect } from "react";
import { useOrbitStore } from "../store/useOrbitStore";
import { useSwipe } from "../hooks/useSwipe";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { BottomPill } from "./BottomPill";
import { Drawer } from "./Drawer";
import { HotkeysPrompt } from "./HotkeysPrompt";

export function OrbitHUD() {
  const phase = useOrbitStore((s) => s.phase);

  useSwipe(phase === "orbit");

  useEffect(() => {
    const handleKeyDown = (e) => {
      const store = useOrbitStore.getState();
      if (store.phase !== "orbit") return;

      if (e.key === "ArrowRight") {
        store.next();
      } else if (e.key === "ArrowLeft") {
        store.prev();
      } else if (e.key === "Enter") {
        if (store.current === 0) {
          store.go(1);
        } else {
          store.enter();
        }
      } else if (e.key === "Escape") {
        store.leave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (phase !== "orbit") return null;

  return (
    <div className="animate-fade-in">
      <Header />
      <Navigation />
      <BottomPill />
      <Drawer />
      <HotkeysPrompt />
    </div>
  );
}
