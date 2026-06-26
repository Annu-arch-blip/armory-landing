/**
 
 * featuresStore.js — the ONE shared "active index" value
 
 *
 * THIS IS THE KEY TO THE "CONTEXT LOCK" REQUIREMENT.
 *
 * The brief says: if you're hovering bento card #2 on desktop,
 * and you resize the window past the mobile breakpoint while
 * still hovering, the accordion on mobile must open item #2
 * automatically — smoothly, with no manual re-click needed.
 *
 * The trick: we don't write separate "desktop hover state" and
 * "mobile open state" that we then try to sync between. Instead,
 * BOTH the bento grid and the accordion read from and write to
 * this ONE shared value (activeIndex). There's nothing to
 * "transfer" on resize because there was only ever one value.
 * When the layout switches from grid to accordion, the accordion
 * just asks "what's the current activeIndex?" and opens that
 * panel — it was already correct before the resize even happened.
 *
 * Same pub-sub pattern as pricingStore.js (see that file's
 * comments for the full explanation of why we avoid useState
 * here and use a plain external store instead).
 * ============================================================
 */

let activeIndex = null; // null = nothing active/hovered/open

const listeners = new Set();

// --- Resize guard (via ResizeObserver, not timestamps) ---
//
// PROBLEM: when the browser window is resized, an element can
// shift position out from under the mouse cursor. The browser
// then fires a "mouseleave" on that element even though the
// user's cursor never moved and their intent never changed.
// If we let that mouseleave clear activeIndex, the Context Lock
// breaks at exactly the moment we need it most.
//
// We tried two timer/timestamp-based approaches first, but both
// raced against the browser's actual event ordering (mouseleave
// sometimes fires in the same tick as resize, sometimes before).
// Racing timestamps against browser-internal event ordering is
// inherently fragile.
//
// THE DETERMINISTIC FIX: instead of guessing from timing, we
// directly observe the <body> element's size with a
// ResizeObserver. ResizeObserver callbacks are guaranteed to
// fire when an observed element's box actually changes size —
// this is a real signal, not a guess. We flip a "currently
// resizing" flag to true the instant a resize is observed, and
// schedule it back to false shortly after things settle down.
// While that flag is true, we ignore any request to CLEAR the
// active index. Setting a real, specific index always still
// applies immediately, so genuine new hovers/clicks are never
// blocked — only spurious "clear to null" calls during a resize
// are suppressed.
let isCurrentlyResizing = false;
let resizeSettleTimeout = null;

if (typeof window !== 'undefined' && typeof ResizeObserver !== 'undefined') {
  const observer = new ResizeObserver(() => {
    isCurrentlyResizing = true;
    clearTimeout(resizeSettleTimeout);
    resizeSettleTimeout = setTimeout(() => {
      isCurrentlyResizing = false;
    }, 300);
  });
  observer.observe(document.documentElement);
}

export function getActiveIndex() {
  return activeIndex;
}

export function setActiveIndex(index) {
  if (index === null && isCurrentlyResizing) {
    // Ignore this clear request -- almost certainly a spurious
    // mouseleave caused by the resize reflow, not real user intent.
    return;
  }
  if (activeIndex === index) return; // avoid redundant notifications
  activeIndex = index;
  listeners.forEach((listener) => listener(activeIndex));
}

export function subscribeActiveIndex(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}