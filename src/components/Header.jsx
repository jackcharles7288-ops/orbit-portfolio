import React from "react";
import { useOrbitStore } from "../store/useOrbitStore";
import { celestialBodies } from "../data/projects";
import { cn } from "../utils/cn";

export function Header() {
  const current = useOrbitStore((s) => s.current);
  const go = useOrbitStore((s) => s.go);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-7">
      <div className="pointer-events-auto">
        <div className="font-display text-sm font-semibold tracking-tight text-white">
          AI<span className="text-amber-300">.</span>orbit
        </div>
        <div className="mt-0.5 font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">
          Portfolio system
        </div>
      </div>

      <nav className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2 py-1.5 backdrop-blur-md sm:px-2.5 sm:py-2">
        {celestialBodies.map((body, index) => (
          <button
            key={body.id}
            onClick={() => go(index)}
            title={body.name}
            className="group relative flex h-6 items-center justify-center px-1"
          >
            <span
              className={cn(
                "block rounded-full transition-all duration-300",
                index === 0 ? "h-2.5 w-2.5" : "h-1.5 w-1.5",
                index === current
                  ? "scale-150 shadow-[0_0_10px_currentColor]"
                  : "opacity-50 group-hover:opacity-100"
              )}
              style={{ background: body.accent, color: body.accent }}
            />
            <span className="pointer-events-none absolute top-full mt-1 hidden whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.25em] text-white/70 group-hover:block">
              {body.name}
            </span>
          </button>
        ))}
      </nav>
    </header>
  );
}
