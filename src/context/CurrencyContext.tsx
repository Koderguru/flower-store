'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type Currency = 'IDR' | 'USD';

type CurrencyContextValue = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountInIdr: number) => string;
  convertAmount: (amountInIdr: number, targetCurrency?: Currency) => number;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const conversionRates: Record<Currency, number> = {
  IDR: 1,
  USD: 1 / 15500,
};

const currencySymbols: Record<Currency, string> = {
  IDR: 'IDR',
  USD: 'USD',
};

const currencyFormatters: Record<Currency, Intl.NumberFormat> = {
  IDR: new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }),
  USD: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
};

type CurrencyProviderProps = {
  children: ReactNode;
};

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState<Currency>('IDR');

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('currency') : null;
    if (stored === 'IDR' || stored === 'USD') {
      setCurrency(stored);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('currency', currency);
    }
  }, [currency]);

  const formatPrice = (amountInIdr: number) => {
    const converted = amountInIdr * conversionRates[currency];
    const formatted = currencyFormatters[currency].format(converted);
    return `${currencySymbols[currency]} ${formatted}`;
  };

  const convertAmount = (amountInIdr: number, targetCurrency: Currency = currency) => {
    return amountInIdr * conversionRates[targetCurrency];
  };

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatPrice,
      convertAmount,
    }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

