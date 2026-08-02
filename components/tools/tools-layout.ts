/** Corner-anchored FAB — no full-width bar (avoids mobile overflow). */
export const toolsFabAnchorClassName =
  "fixed z-[100] bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] sm:bottom-6 sm:right-6";

/** Panels sit above the 3rem FAB + gap, aligned to the same corner. */
export const toolsPanelPositionClassName =
  "fixed z-[100] bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] right-[calc(1rem+env(safe-area-inset-right,0px))] sm:bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] sm:right-6";

export const toolsPanelSizeClassName =
  "w-[min(24rem,calc(100vw-2rem))] max-h-[min(70vh,70dvh)]";
