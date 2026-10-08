import React from "react";
import { useOrbitStore } from "../store/useOrbitStore";
import { celestialBodies } from "../data/projects";
import { cn } from "../utils/cn";

export function Navigation() {
  const current = useOrbitStore((s) => s.current);
  const total = useOrbitStore((s) => s.total);
  const next = useOrbitStore((s) => s.next);
  const prev = useOrbitStore((s) => s.prev);
  const entered = useOrbitStore((s) => s.entered);

  const isShifted = current === 0 || entered;

  const NavButton = ({ dir, disabled, onClick, label }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "l" ? "Previous body" : "Next body"}
      title={label}
      className={cn(
        "pointer-events-auto group flex items-center gap-3 rounded-full border border-white/15 bg-black/30 backdrop-blur-md transition-all duration-300",
        "h-12 w-12 justify-center sm:h-14 sm:w-14 hover:border-white/40 hover:bg-white/10",
        disabled && "pointer-events-none opacity-0 scale-75"
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className={cn(
          "h-5 w-5 stroke-white fill-none transition-transform",
          dir === "l" ? "group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"
        )}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {dir === "l" ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-20 flex items-center justify-between px-4 sm:px-8 transition-all duration-500",
        isShifted
          ? "top-[38%] md:top-1/2 md:pr-[46%] lg:pr-[40%]"
          : "top-1/2",
        "-translate-y-1/2"
      )}
    >
      <NavButton
        dir="l"
        disabled={current <= 0}
        onClick={prev}
        label={celestialBodies[current - 1]?.name}
      />
      <NavButton
        dir="r"
        disabled={current >= total}
        onClick={next}
        label={celestialBodies[current + 1]?.name}
      />
    </div>
  );
}
