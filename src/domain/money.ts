import type { Currency } from './types.ts'

// Intl already knows each ISO currency's minor-unit decimal places (JPY: 0,
// SGD: 2, BHD: 3, ...); asking it once and caching avoids hand-maintaining
// that table ourselves.
const minorUnitDigitsCache = new Map<string, number>()

function minorUnitDigits(currencyCode: string): number {
  let digits = minorUnitDigitsCache.get(currencyCode)
  if (digits === undefined) {
    digits =
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
      }).resolvedOptions().maximumFractionDigits ?? 2
    minorUnitDigitsCache.set(currencyCode, digits)
  }
  return digits
}

/** Formats an integer minor-unit amount (e.g. cents) as localised currency text. */
export function formatMoney(amount: number, currency: Currency, locale = 'en-US'): string {
  const digits = minorUnitDigits(currency.code)
  const majorUnits = amount / 10 ** digits
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.code,
  }).format(majorUnits)
}
