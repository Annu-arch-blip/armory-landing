import PricingControls from '../ui/PricingControls';
import PricingCard from '../ui/PricingCard';
import { PRICING_TIERS } from '../../data/pricingMatrix';

export default function PricingSection() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="px-6 py-24 max-w-6xl mx-auto"
    >
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <h2
          id="pricing-heading"
          className="text-3xl md:text-4xl font-semibold text-[var(--text-on-dark)] mb-3"
        >
          Simple, transparent pricing
        </h2>
        <p className="text-[var(--text-on-dark-muted)]">
          One plan, every currency. Pricing that scales as fast as your agents do.
        </p>
      </div>
      <PricingControls />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {PRICING_TIERS.map((tier) => (
          <PricingCard key={tier.key} tier={tier} />
        ))}
      </div>
    </section>
  );
}