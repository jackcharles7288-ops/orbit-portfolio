import React from "react";
import { useOrbitStore } from "../store/useOrbitStore";
import { projects } from "../data/projects";
import { cn } from "../utils/cn";

export function BottomPill() {
  const current = useOrbitStore((s) => s.current);
  const entered = useOrbitStore((s) => s.entered);
  const enter = useOrbitStore((s) => s.enter);

  if (current === 0) return null;

  const project = projects[current - 1];
  const isVisible = !entered;

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-20 flex flex-col items-center px-6 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
    >
      <p
        className="font-mono text-[10px] tracking-[0.4em] uppercase"
        style={{ color: project.accent }}
      >
        {String(current).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · {project.kind}
      </p>

      <h2 className="mt-2 font-display text-4xl sm:text-6xl font-semibold tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
        {project.name}
      </h2>

      <p className="mt-2 max-w-md text-sm text-white/70">
        {project.tagline}
      </p>

      <p className="mt-3 font-mono text-[9px] tracking-[0.3em] uppercase text-white/35 md:hidden">
        Swipe to travel between planets
      </p>

      <button
        onClick={enter}
        className={cn(
          "pointer-events-auto mt-6 rounded-full border px-8 py-3 font-mono text-xs tracking-[0.35em] uppercase backdrop-blur-md transition hover:bg-white/10",
          !isVisible && "pointer-events-none"
        )}
        style={{ borderColor: `${project.accent}80`, color: project.accent }}
      >
        Enter Planet ↓
      </button>
    </div>
  );
}
