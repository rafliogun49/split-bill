import { formatMoney } from '../../domain'
import { Card } from '../components/Card'
import { focusRing } from '../components/focusRing'
import { copy } from '../copy'
import { formatDate, localeForCurrency } from '../format'
import type { BillHistoryEntry } from '../persistence/billHistory'

export interface HistoryScreenProps {
  entries: BillHistoryEntry[]
  onSelect: (id: string) => void
}

// archivedAt is a full ISO timestamp (Date.toISOString()), not the
// YYYY-MM-DD Bill.date shape formatDate expects — formatted separately, at
// day precision, since ADR-0008 / DESIGN.md screen 12 ask for *when it was
// archived* alongside Place/Date/Total, not the exact second.
function formatArchivedAt(archivedAt: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(archivedAt))
}

// DESIGN.md screen 12: archived Bills newest-first — Place, Date, Total —
// built entirely from localStorage (ADR-0008). Every row is a button into a
// read-only Summary; there is nothing here to edit, so the row itself is
// the only interactive surface.
export function HistoryScreen({ entries, onSelect }: HistoryScreenProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 p-4 lg:p-6">
      <h2 className="text-headline-sm uppercase text-on-surface">{copy.history.heading}</h2>

      {entries.length === 0 ? (
        <Card>
          <p className="text-body-md text-on-surface-variant">{copy.history.empty}</p>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => {
            const locale = localeForCurrency(entry.currencyCode)
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => onSelect(entry.id)}
                  className={`flex w-full flex-col gap-1 border border-pure-black bg-surface-container-lowest p-4 text-left shadow-sm ${focusRing}`}
                >
                  <span className="text-label-bold uppercase text-on-surface">
                    {entry.place || copy.history.untitledPlace}
                  </span>
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-body-md text-on-surface-variant">
                      {entry.date ? formatDate(entry.date, locale) : '—'}
                    </span>
                    <span className="text-amount-sm text-on-surface">
                      {formatMoney(entry.total, { code: entry.currencyCode }, locale)}
                    </span>
                  </span>
                  <span className="text-label-sm uppercase text-on-surface-variant">
                    {copy.history.archivedOn} {formatArchivedAt(entry.archivedAt, locale)}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
