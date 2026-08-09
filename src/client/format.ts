// The Intl locale used to render a Bill currency's own convention (DESIGN.md
// §8 AmountField, §"Formatting"): "Rp 156.177" for IDR, "$156.18" for SGD.
// formatMoney itself is currency-agnostic about locale, so the client picks
// one that matches each currency's usual grouping/decimals rather than
// defaulting every currency to en-US.
const localeByCurrency: Record<string, string> = {
  IDR: 'id-ID',
  SGD: 'en-SG',
}

export function localeForCurrency(currencyCode: string): string {
  return localeByCurrency[currencyCode] ?? 'en-US'
}

// Bill.date is an ISO "YYYY-MM-DD" string from a <input type="date">. Parsed
// via its parts rather than `new Date(iso)` — the latter reads as UTC
// midnight, which rolls back a day in any timezone behind UTC.
export function formatDate(dateIso: string, locale: string): string {
  const [year, month, day] = dateIso.split('-').map(Number)
  if (!year || !month || !day) return dateIso
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, day),
  )
}
