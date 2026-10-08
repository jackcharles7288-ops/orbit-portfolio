import { create } from "zustand";

export const useOrbitStore = create((set, get) => ({
  phase: "intro", // "intro" | "orbit"
  current: 0,     // 0 = host/sun (Abdul), 1..6 = projects
  entered: false, // true when user enters planet details or clicked
  total: 0,
  loaded: 0,
  assetsTotal: 0,
  gated: 0,
  gateTotal: 0,

  setPhase: (phase) => set({ phase }),
  go: (target) => {
    const { total } = get();
    const current = Math.max(0, Math.min(total, target));
    set({ current, entered: false });
  },
  next: () => get().go(get().current + 1),
  prev: () => get().go(get().current - 1),
  enter: () => set({ entered: true }),
  leave: () => set({ entered: false }),
  setTotal: (total) => set({ total }),
  setAssetsTotal: (assetsTotal) => set({ assetsTotal }),
  assetDone: () => set((state) => ({ loaded: state.loaded + 1 })),
  setGateTotal: (gateTotal) => set({ gateTotal: Math.max(0, gateTotal) }),
  gateDone: () => set((state) => ({ gated: state.gated + 1 })),
}));
