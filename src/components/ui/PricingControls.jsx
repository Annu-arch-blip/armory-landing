/**
 * PricingControls.jsx — the Monthly/Annual + currency buttons
 *
 * This component renders the toggle UI. When clicked, it calls
 * setCycle() / setCurrency() from pricingStore.js DIRECTLY.
 */

import { useState } from 'react';
import { setCurrency, setCycle, getPricingState } from '../../data/pricingStore';
import { CURRENCIES, BILLING_CYCLES } from '../../data/pricingMatrix';

export default function PricingControls() {
  const initial = getPricingState();
  const [activeCycle, setActiveCycle] = useState(initial.cycle);
  const [activeCurrency, setActiveCurrency] = useState(initial.currency);

  function handleCycleClick(cycleKey) {
    setCycle(cycleKey);        // updates the isolated store -> price spans update
    setActiveCycle(cycleKey);  // updates only this control's own highlight
  }

  function handleCurrencyClick(currencyKey) {
    setCurrency(currencyKey);
    setActiveCurrency(currencyKey);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12">
      {/* Monthly / Annual toggle */}
      <div className="inline-flex bg-[var(--bg-surface)] rounded-full p-1 border border-white/10">
        {Object.values(BILLING_CYCLES).map((cycle) => (
          <button
            key={cycle.key}
            onClick={() => handleCycleClick(cycle.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-[180ms] ease-out cursor-pointer ${
              activeCycle === cycle.key
                ? 'bg-[var(--accent-primary)] text-[var(--text-on-light)]'
                : 'text-[var(--text-on-dark-muted)] hover:text-[var(--text-on-dark)]'
            }`}
          >
            {cycle.label}
            {cycle.key === 'annual' && (
              <span className="ml-2 text-xs opacity-80">Save 20%</span>
            )}
          </button>
        ))}
      </div>

      {/* Currency switcher */}
      <div className="inline-flex bg-[var(--bg-surface)] rounded-full p-1 border border-white/10">
        {Object.values(CURRENCIES).map((currency) => (
          <button
            key={currency.key}
            onClick={() => handleCurrencyClick(currency.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-[180ms] ease-out cursor-pointer ${
              activeCurrency === currency.key
                ? 'bg-[var(--accent-secondary)] text-[var(--text-on-light)]'
                : 'text-[var(--text-on-dark-muted)] hover:text-[var(--text-on-dark)]'
            }`}
          >
            {currency.symbol} {currency.label}
          </button>
        ))}
      </div>
    </div>
  );
}