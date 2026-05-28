import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  /** How many units equal 1 USD (approximate fixed rates — production would fetch live) */
  ratePerUSD: number;
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'XAF', name: 'CFA Franc (Central Africa)', symbol: 'FCFA', ratePerUSD: 600 },
  { code: 'XOF', name: 'CFA Franc (West Africa)',    symbol: 'FCFA', ratePerUSD: 600 },
  { code: 'NGN', name: 'Nigerian Naira',              symbol: '₦',    ratePerUSD: 1600 },
  { code: 'GHS', name: 'Ghanaian Cedi',              symbol: 'GH₵',  ratePerUSD: 15 },
  { code: 'KES', name: 'Kenyan Shilling',            symbol: 'KSh',  ratePerUSD: 130 },
  { code: 'ZAR', name: 'South African Rand',         symbol: 'R',    ratePerUSD: 19 },
  { code: 'EGP', name: 'Egyptian Pound',             symbol: 'E£',   ratePerUSD: 48 },
  { code: 'USD', name: 'US Dollar',                  symbol: '$',    ratePerUSD: 1 },
  { code: 'EUR', name: 'Euro',                       symbol: '€',    ratePerUSD: 0.92 },
  { code: 'GBP', name: 'British Pound',              symbol: '£',    ratePerUSD: 0.79 },
];

interface CurrencyState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  /** Convert an amount from USD to the selected currency */
  fromUSD: (usdAmount: number) => number;
  /** Format a local-currency amount as a display string */
  format: (localAmount: number) => string;
}

const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0]; // XAF

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: DEFAULT_CURRENCY,

      setCurrency: (currency) => set({ currency }),

      fromUSD: (usdAmount) => {
        const rate = get().currency.ratePerUSD;
        return Math.round(usdAmount * rate);
      },

      format: (localAmount) => {
        const { symbol, code } = get().currency;
        return `${symbol}${Number(localAmount).toLocaleString()} ${code}`;
      },
    }),
    { name: 'buildhub-currency' }
  )
);
