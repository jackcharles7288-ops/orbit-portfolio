import React, { useState, useEffect } from "react";
import { useOrbitStore } from "../store/useOrbitStore";
import { person } from "../data/person";
import { projects } from "../data/projects";

export function IntroScreen() {
  const phase = useOrbitStore((s) => s.phase);
  const setPhase = useOrbitStore((s) => s.setPhase);
  const go = useOrbitStore((s) => s.go);
  const loaded = useOrbitStore((s) => s.loaded);
  const assetsTotal = useOrbitStore((s) => s.assetsTotal);
  const gated = useOrbitStore((s) => s.gated);
  const gateTotal = useOrbitStore((s) => s.gateTotal);

  const [step, setStep] = useState(0);
  const [fading, setFading] = useState(false);

  const isReady = gateTotal > 0 && gated >= gateTotal;
  const progressPercent = assetsTotal ? Math.round((loaded / assetsTotal) * 100) : 0;
  const isStreaming = isReady && loaded < assetsTotal;

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 600);
    const t2 = setTimeout(() => setStep(2), 2000);
    const t3 = setTimeout(() => setStep(3), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase !== "intro") return null;

  const handleEnterOrbit = () => {
    setFading(true);
    setTimeout(() => {
      go(0);
      setPhase("orbit");
    }, 500);
  };

  const nameLetters = person.name.split("");

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-30 flex flex-col items-center justify-center px-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-center transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(2,3,10,0.15) 0%, rgba(2,3,10,0.75) 100%)",
      }}
    >
      <div className="pointer-events-none select-none px-6">
        <p
          className={`font-mono text-[11px] tracking-[0.5em] uppercase text-white/50 transition-all duration-700 ${
            step >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          Incoming transmission
        </p>

        <h1 className="mt-5 font-display text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight text-white">
          {nameLetters.map((char, idx) => (
            <span
              key={idx}
              className="inline-block"
              style={{
                opacity: step >= 1 ? 1 : 0,
                transform:
                  step >= 1 ? "translateY(0) rotateX(0)" : "translateY(24px) rotateX(60deg)",
                filter: step >= 1 ? "blur(0)" : "blur(8px)",
                transition: `all .8s cubic-bezier(.2,.8,.2,1) ${idx * 55}ms`,
                whiteSpace: char === " " ? "pre" : undefined,
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        <div
          className={`mt-6 flex items-center justify-center gap-4 transition-all duration-700 ${
            step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber-300/70" />
          <span className="font-mono text-sm sm:text-base tracking-[0.35em] uppercase text-amber-200">
            Age{" "}
            <span className="text-white text-xl sm:text-2xl font-display font-semibold tracking-normal">
              {person.age}
            </span>
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-amber-300/70" />
        </div>
      </div>

      <div
        className={`mt-14 flex flex-col items-center gap-4 transition-all duration-700 ${
          step >= 3
            ? "pointer-events-auto opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <button
          onClick={handleEnterOrbit}
          disabled={!isReady}
          className="group relative overflow-hidden rounded-full border border-amber-200/40 bg-white/5 px-9 py-3.5 font-mono text-xs tracking-[0.4em] uppercase text-amber-100 backdrop-blur-md transition hover:border-amber-200/80 hover:bg-amber-200/10 disabled:cursor-wait"
        >
          <span
            className="absolute inset-y-0 left-0 bg-amber-300/15 transition-all duration-300"
            style={{ width: isReady ? "0%" : `${progressPercent}%` }}
          />
          <span className="relative flex items-center gap-3">
            {isReady ? (
              <>
                Enter Orbit
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  →
                </span>
              </>
            ) : (
              <>Calibrating telescope · {progressPercent}%</>
            )}
          </span>
        </button>

        <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35">
          <span className="hidden md:inline">
            {projects.length} projects · 1 star · or tap a planet's name to jump straight to it
          </span>
          <span className="md:hidden">{projects.length} projects · 1 star · swipe to explore</span>
        </p>

        <p
          className={`font-mono text-[9px] tracking-[0.3em] uppercase text-white/25 transition-opacity duration-500 ${
            isStreaming ? "opacity-100" : "opacity-0"
          }`}
        >
          streaming surface maps · {loaded}/{assetsTotal}
        </p>
      </div>
    </div>
  );
}
