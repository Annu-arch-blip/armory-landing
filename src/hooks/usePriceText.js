/**
 * usePriceText.js — connects ONE price display to the store
 *
 * WHAT THIS HOOK DOES, IN PLAIN WORDS:
 *
 * Each pricing card has one price (e.g. "₹1,499/month"). This
 * hook gives that price a ref (a direct handle to its actual
 * <span> in the page). When currency or billing cycle changes
 * anywhere on the page, this hook recalculates JUST this card's
 * price and writes the new text straight into that <span> using
 * `el.textContent = ...`.
 *
 * THE KEY POINT: we are NOT calling useState here for the price
 * text. We're bypassing React's render cycle and editing the DOM
 * directly — like vanilla JavaScript would. That's exactly what
 * "isolate updates to localized DOM text nodes" means in the brief.
 *
 * USAGE in a component:
 *   const priceRef = usePriceText(tier)
 *   ...
 *   <span ref={priceRef} />
 *
 * On first render, the <span> starts empty, then this hook fills
 * it in immediately (see the useEffect with empty deps below) and
 * keeps it updated forever after, without React re-rendering the
 * card itself.
 */

import { useEffect, useRef } from 'react';
import { getPrice, formatPrice } from '../data/pricingMatrix';
import { getPricingState, subscribe } from '../data/pricingStore';

export function usePriceText(tier) {
  const spanRef = useRef(null);

  useEffect(() => {
    // Step 1: write the initial price immediately on mount.
    function applyPrice() {
      const { currency, cycle } = getPricingState();
      const priceResult = getPrice(tier, cycle, currency);
      if (spanRef.current) {
        spanRef.current.textContent = formatPrice(priceResult);
      }
    }

    applyPrice();

    // Step 2: subscribe to the store. Every time someone calls
    // setCurrency() or setCycle() (from anywhere on the page),
    // this card's price re-calculates and updates ITS OWN span only.
    const unsubscribe = subscribe(applyPrice);

    // Step 3: cleanup — stop listening if this card ever unmounts.
    return () => unsubscribe();
  }, [tier]);

  return spanRef;
}