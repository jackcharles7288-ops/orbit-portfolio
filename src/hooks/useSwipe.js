import { useEffect } from "react";
import { useOrbitStore } from "../store/useOrbitStore";

const SWIPE_THRESHOLD_X = 48;
const SWIPE_RATIO = 1.2;

export function useSwipe(enabled) {
  useEffect(() => {
    if (!enabled) return;

    let startX = 0;
    let startY = 0;
    let isTracking = false;

    const isInteractive = (target) =>
      target instanceof Element &&
      Boolean(target.closest("button, a, aside, input, textarea, select, [data-no-swipe]"));

    const handleTouchStart = (e) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      isTracking = !isInteractive(touch.target);
    };

    const handleTouchMove = (e) => {
      if (isTracking && e.touches.length !== 1) {
        isTracking = false;
      }
    };

    const handleTouchEnd = (e) => {
      if (!isTracking) return;
      isTracking = false;
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - startX;
      const deltaY = touch.clientY - startY;

      if (
        Math.abs(deltaX) < SWIPE_THRESHOLD_X ||
        Math.abs(deltaX) < Math.abs(deltaY) * SWIPE_RATIO
      ) {
        return;
      }

      const store = useOrbitStore.getState();
      if (deltaX < 0) {
        store.next();
      } else {
        store.prev();
      }
    };

    const handleTouchCancel = () => {
      isTracking = false;
    };

    const options = { passive: true };
    window.addEventListener("touchstart", handleTouchStart, options);
    window.addEventListener("touchmove", handleTouchMove, options);
    window.addEventListener("touchend", handleTouchEnd, options);
    window.addEventListener("touchcancel", handleTouchCancel, options);

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [enabled]);
}
