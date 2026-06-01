/**
 * Live FX rates from a free, no-key provider (open.er-api.com), base = USD.
 * Cached in-memory for 1 hour; falls back to a static table if the fetch fails.
 */

interface FxPayload {
  base: string;
  rates: Record<string, number>; // units of currency per 1 USD
  fetchedAt: number;
  source: 'live' | 'fallback';
}

const ONE_HOUR = 60 * 60 * 1000;
const PROVIDER = 'https://open.er-api.com/v6/latest/USD';

// Used only if the provider is unreachable on first load
const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, XAF: 600, XOF: 600,
  NGN: 1600, GHS: 15, KES: 130, ZAR: 19, EGP: 48,
};

let cache: FxPayload | null = null;

export const getFxRates = async (): Promise<FxPayload> => {
  if (cache && Date.now() - cache.fetchedAt < ONE_HOUR) {
    return cache;
  }

  try {
    const res = await fetch(PROVIDER);
    const data: any = await res.json();
    if (data?.result !== 'success' || !data?.rates) {
      throw new Error('Unexpected FX provider response');
    }
    cache = {
      base: 'USD',
      rates: data.rates,
      fetchedAt: Date.now(),
      source: 'live',
    };
    return cache;
  } catch (err: any) {
    console.error('⚠️  FX fetch failed, using fallback rates:', err.message);
    // Cache the fallback briefly so we retry the live provider within the hour
    cache = { base: 'USD', rates: FALLBACK_RATES, fetchedAt: Date.now(), source: 'fallback' };
    return cache;
  }
};
