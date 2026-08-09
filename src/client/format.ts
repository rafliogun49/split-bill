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
