/**
 * PRICING MATRIX — Feature 1 data + logic
 *
 * WHY THIS FILE EXISTS:
 * The brief says we cannot hardcode prices anywhere in the UI.
 * Instead, every price the user sees must be CALCULATED from
 * this config, live, in the browser. This file is the single
 * source of truth — UI components just call getPrice(...) and
 * never do their own math.
 *
 * THE THREE DIMENSIONS (this is the "multi-dimensional matrix"
 * the brief asks for):
 *   1. TIER     -> which pricing plan (Starter / Pro / Enterprise)
 *   2. CYCLE    -> monthly or annual
 *   3. CURRENCY -> INR / USD / EUR
 *
 * HOW THE MATH WORKS:
 *   - Every tier has ONE base monthly rate, in INR.
 *   - To get a price in another currency, we multiply by a
 *     "regional tariff variable" (an exchange-like multiplier).
 *   - To get the ANNUAL price, we apply a flat 20% discount
 *     to the monthly rate, then multiply by 12.
 *
 * This means: if you change baseMonthlyINR for a tier, EVERY
 * currency and EVERY cycle for that tier updates automatically,
 * because they're all derived, not stored separately.
 */

// Dimension 2: Billing cycles
export const BILLING_CYCLES = {
  monthly: {
    key: 'monthly',
    label: 'Monthly',
    discountMultiplier: 1, // no discount
  },
  annual: {
    key: 'annual',
    label: 'Annual',
    discountMultiplier: 0.8, // flat 20% annual discount
  },
};

// Dimension 3: Currencies + their regional tariff variables ---
// "regionalTariff" = how we convert from our base INR rate into
// that currency. These are illustrative, fixed multipliers
// (not live exchange rates) — intentional per the brief, since
// it asks for a configured tariff variable, not a live FX API.
export const CURRENCIES = {
  INR: {
    key: 'INR',
    label: 'INR',
    symbol: '₹',
    regionalTariff: 1,
  },
  USD: {
    key: 'USD',
    label: 'USD',
    symbol: '$',
    regionalTariff: 0.012,
  },
  EUR: {
    key: 'EUR',
    label: 'EUR',
    symbol: '€',
    regionalTariff: 0.011,
  },
};

// Dimension 1: Tiers
// baseMonthlyINR is the ONLY raw number we ever hand-type.
// Everything else (annual price, USD price, EUR price, annual+USD, etc.)
// is computed from this single value.
export const PRICING_TIERS = [
  {
    key: 'starter',
    name: 'Starter',
    tagline: 'For individuals getting started with automation.',
    baseMonthlyINR: 1499,
    features: [
      'Up to 3 AI agents',
      '5,000 automation runs / month',
      'Community support',
      'Basic analytics dashboard',
    ],
    highlighted: false,
  },
  {
    key: 'pro',
    name: 'Pro',
    tagline: 'For growing teams scaling their workflows.',
    baseMonthlyINR: 4999,
    features: [
      'Up to 20 AI agents',
      '50,000 automation runs / month',
      'Priority email support',
      'Advanced analytics + exports',
      'Custom integrations',
    ],
    highlighted: true,
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    tagline: 'For organizations that need scale and control.',
    baseMonthlyINR: 14999,
    features: [
      'Unlimited AI agents',
      'Unlimited automation runs',
      'Dedicated account manager',
      'SSO + audit logs',
      'Custom SLA',
    ],
    highlighted: false,
  },
];

/**
 * getPrice — THE core calculation function.
 *
 * @param {object} tier        - one entry from PRICING_TIERS
 * @param {string} cycleKey    - 'monthly' | 'annual'
 * @param {string} currencyKey - 'INR' | 'USD' | 'EUR'
 * @returns {object} { amount: number, symbol: string, perLabel: string }
 *
 * Logic, step by step:
 *   1. Start with the tier's base MONTHLY rate in INR.
 *   2. Apply the cycle's discount multiplier
 *      (annual = pay for 12 months at 80% of monthly rate each).
 *   3. Convert to the target currency using its regional tariff.
 *   4. Round sensibly (whole numbers for INR, 2 decimals for USD/EUR).
 */
export function getPrice(tier, cycleKey, currencyKey) {
  const cycle = BILLING_CYCLES[cycleKey];
  const currency = CURRENCIES[currencyKey];

  if (!tier || !cycle || !currency) {
    throw new Error('getPrice: invalid tier, cycle, or currency key');
  }

  // Step 1 + 2: discounted monthly rate, still in INR
  const discountedMonthlyINR = tier.baseMonthlyINR * cycle.discountMultiplier;

  // For annual billing we show the TOTAL yearly price.
  // For monthly billing we show the per-month price.
  const rawINR =
    cycleKey === 'annual' ? discountedMonthlyINR * 12 : discountedMonthlyINR;

  // Step 3: convert using the regional tariff
  const converted = rawINR * currency.regionalTariff;

  // Step 4: rounding rules differ slightly by currency, since INR
  // numbers are large (no decimals needed) and USD/EUR are small.
  const amount =
    currencyKey === 'INR' ? Math.round(converted) : Math.round(converted * 100) / 100;

  return {
    amount,
    symbol: currency.symbol,
    perLabel: cycleKey === 'annual' ? '/year' : '/month',
  };
}

/**
 * formatPrice — turns a getPrice() result into a display string.
 * Kept separate from getPrice so components can also use the raw
 * number if they ever need it (e.g. for sorting or comparisons).
 */
export function formatPrice(priceResult) {
  const { amount, symbol, perLabel } = priceResult;
  const formattedAmount =
    symbol === '₹' ? amount.toLocaleString('en-IN') : amount.toLocaleString('en-US');
  return `${symbol}${formattedAmount}${perLabel}`;
}