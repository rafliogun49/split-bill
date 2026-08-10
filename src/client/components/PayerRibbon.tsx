import { copy } from '../copy'
import { dinerTextClass } from '../dinerFill'
import { focusRing } from './focusRing'

export interface PayerRibbonProps {
  /** Diner's position in Bill.diners by join order — picks the diner-N ink (DESIGN.md §"Diner scale"). */
  joinIndex: number
  onClick: () => void
  /** Full accessible name — DinerSetupScreen composes "Remove as Payer — <name>". */
  label: string
}

// DinerSetupScreen's Payer roster row (docs/design mockup §6, issue #48):
// a ribbon-style "PAYER" tag replacing the old toggle-button treatment —
// black fill, the Diner's own diner-N colour as ink, with a black flag point
// (border trick, same as the mockup's own CSS). Rule 1 (no white text) holds:
// diner-N-on-black measures the same ratio DESIGN.md's Diner scale table
// already states for black-on-diner-N, since contrast is symmetric between
// the same two colours. Still a real button — tapping it unmarks the Payer,
// same toggle as before, just restyled.
export function PayerRibbon({ joinIndex, onClick, label }: PayerRibbonProps) {
  const ink = dinerTextClass(joinIndex)

  return (
    <button type="button" onClick={onClick} aria-label={label} className={`inline-flex items-center ${focusRing}`}>
      <span className={`bg-pure-black px-2 py-1 text-label-sm uppercase ${ink}`}>{copy.dinerSetup.payerBadge}</span>
      <span
        aria-hidden="true"
        className="h-0 w-0 border-y-[8px] border-l-[8px] border-y-transparent border-l-pure-black"
      />
    </button>
  )
}
