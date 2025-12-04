export type CurrencyCode = "GHS" | "USD" | "EUR" | "GBP";

export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  rate: number; // Rate to GHS (1 unit = X GHS)
}

export const currencies: Record<CurrencyCode, Currency> = {
  GHS: {
    code: "GHS",
    name: "Ghana Cedi",
    symbol: "₵",
    flag: "🇬🇭",
    rate: 1,
  },
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    rate: 15.5, // 1 USD ≈ 15.5 GHS
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    rate: 16.8, // 1 EUR ≈ 16.8 GHS
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    rate: 19.5, // 1 GBP ≈ 19.5 GHS
  },
};

export const formatCurrency = (amount: number, currencyCode: CurrencyCode): string => {
  const currency = currencies[currencyCode];
  return `${currency.symbol}${amount.toLocaleString()}`;
};

export const convertToGHS = (amount: number, fromCurrency: CurrencyCode): number => {
  const currency = currencies[fromCurrency];
  return Math.round(amount * currency.rate);
};

export const convertFromGHS = (ghsAmount: number, toCurrency: CurrencyCode): number => {
  const currency = currencies[toCurrency];
  return Math.round((ghsAmount / currency.rate) * 100) / 100;
};
