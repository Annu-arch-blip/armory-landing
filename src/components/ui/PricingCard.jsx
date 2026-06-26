/*
 * PricingCard.jsx — one tier's card (Starter / Pro / Enterprise)
 *
 * Notice this component has NO useState, NO props for currency
 * or cycle. It receives only `tier` (static data: name, features,
 * etc.) which never changes. The price itself comes from
 * usePriceText(tier), which hands back a ref. We attach that ref
 * to a <span>, and the hook updates that span's text directly —
 * this component's function body never runs again after currency
 * or cycle changes. That's the "state isolation" the brief wants.
 */

import { usePriceText } from '../../hooks/usePriceText';

export default function PricingCard({ tier }) {
  const priceRef = usePriceText(tier);

  return (
    <div
      className={`flex flex-col rounded-2xl p-8 border transition-all duration-[350ms] ease-in-out ${
        tier.highlighted
          ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)] scale-105 md:scale-105'
          : 'bg-[var(--bg-surface)]/40 border-white/10 hover:scale-105 hover:border-[var(--accent-primary)] hover:bg-[var(--bg-surface)]'
      }`}
    >
      {tier.highlighted && (
        <span className="self-start mb-4 text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full bg-[var(--accent-primary)] text-[var(--text-on-light)]">
          Most Popular
        </span>
      )}

      <h3 className="text-2xl font-semibold text-[var(--text-on-dark)] mb-2">
        {tier.name}
      </h3>
      <p className="text-sm text-[var(--text-on-dark-muted)] mb-6">
        {tier.tagline}
      </p>

      {/* THIS is the isolated price text node. */}
      <div className="mb-6">
        <span
          ref={priceRef}
          className="text-4xl font-bold text-[var(--text-on-dark)]"
          style={{ fontFamily: 'var(--font-heading)' }}
        />
      </div>

      <ul className="flex-1 space-y-3 mb-8">
        {tier.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 text-sm text-[var(--text-on-dark-muted)]"
          >
            <span className="text-[var(--accent-primary)] mt-0.5">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 rounded-full font-medium transition-colors duration-[180ms] ease-out cursor-pointer ${
          tier.highlighted
            ? 'bg-[var(--accent-primary)] text-[var(--text-on-light)] hover:opacity-90'
            : 'bg-white/10 text-[var(--text-on-dark)] hover:bg-white/20'
        }`}
      >
        Get Started
      </button>
    </div>
  );
}