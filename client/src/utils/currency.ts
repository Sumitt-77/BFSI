/**
 * Indian Rupee (INR) currency utility functions
 * Implements standard Indian numbering system formatting:
 * Example: 50000 -> ₹50,000
 * Example: 500000 -> ₹5,00,000
 * Example: 1250000 -> ₹12,50,000
 */

export function formatINR(amount: number | string | undefined | null, showSymbol = true): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return showSymbol ? '₹0' : '0';
  }

  const num = Math.round(Number(amount));
  const sign = num < 0 ? '-' : '';
  const absNum = Math.abs(num);

  const formatted = absNum.toLocaleString('en-IN');
  return `${sign}${showSymbol ? '₹' : ''}${formatted}`;
}

export function formatLakhsCrores(amount: number | undefined | null): string {
  if (!amount || isNaN(amount)) return '₹0';

  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10000000) {
    // 1 Crore = 10,000,000
    const cr = (abs / 10000000).toFixed(2).replace(/\.00$/, '');
    return `${sign}₹${cr} Cr`;
  } else if (abs >= 100000) {
    // 1 Lakh = 100,000
    const lk = (abs / 100000).toFixed(2).replace(/\.00$/, '');
    return `${sign}₹${lk} Lakh`;
  } else if (abs >= 1000) {
    const k = (abs / 1000).toFixed(1).replace(/\.0$/, '');
    return `${sign}₹${k}k`;
  }

  return `${sign}₹${abs.toLocaleString('en-IN')}`;
}

export function parseINR(value: string): number {
  if (!value) return 0;
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}
