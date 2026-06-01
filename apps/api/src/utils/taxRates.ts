/**
 * Standard VAT / consumption-tax rates by country, used for BOQ tax estimation.
 * Keys are matched case-insensitively against the project's `country`.
 * Rates are the headline standard rate (decimal, e.g. 0.195 = 19.5%).
 */
const VAT_RATES: Record<string, number> = {
  cameroon: 0.195,
  nigeria: 0.075,
  ghana: 0.15,
  kenya: 0.16,
  'south africa': 0.15,
  "cote d'ivoire": 0.18,
  "côte d'ivoire": 0.18,
  senegal: 0.18,
  rwanda: 0.18,
  tanzania: 0.18,
  uganda: 0.18,
};

export const DEFAULT_VAT_RATE = 0.18;

/**
 * Returns the VAT rate (decimal) for a country name. Falls back to a regional
 * default when the country is unknown or not provided.
 */
export const getVatRate = (country?: string): number => {
  if (!country) return DEFAULT_VAT_RATE;
  const key = country.trim().toLowerCase();
  return VAT_RATES[key] ?? DEFAULT_VAT_RATE;
};
