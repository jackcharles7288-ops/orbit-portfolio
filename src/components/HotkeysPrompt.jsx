import React from "react";
import { useOrbitStore } from "../store/useOrbitStore";

export function HotkeysPrompt() {
  const current = useOrbitStore((s) => s.current);

  return (
    <div className="pointer-events-none fixed bottom-4 left-5 z-20 hidden md:block font-mono text-[10px] tracking-[0.3em] uppercase text-white/30">
      ← → navigate · {current === 0 ? "enter to visit first planet" : "enter to land · esc to leave"}
    </div>
  );
}
