import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Bill, Diner, DinerId } from '../../domain'
import { copy } from '../copy'
import { dinerFillClass } from '../dinerFill'
import { TrashIcon } from '../icons'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { focusRing } from '../components/focusRing'
import { NameChip } from '../components/NameChip'
import { PayerRibbon } from '../components/PayerRibbon'
import { TextField } from '../components/TextField'
import { forgetDinerName, loadRememberedDinerNames, rememberDinerName } from '../persistence/dinerNames'

export interface DinerSetupScreenProps {
  bill: Bill
  onBillChange: (next: Bill) => void
  onContinue: () => void
}

// joinIndex is assigned from the highest one seen so far, never from the
// live array length — length shrinks when a Diner is removed, which would
// otherwise reassign every later Diner's colour (DESIGN.md "Diner scale" is
// allocated once, on joining).
function newDiner(name: string, existing: Diner[]): Diner {
  const nextJoinIndex = existing.reduce((max, d) => Math.max(max, d.joinIndex), -1) + 1
  return { id: crypto.randomUUID(), name, joinIndex: nextJoinIndex }
}

// DESIGN.md screen 7 / docs/design mockup §6: remembered NameChips above a
// text field, current Diners as removable rows carrying their own diner-N
// fill, one markable as Payer via a ribbon-style tag (PayerRibbon) — the
// others get a "Make Payer" action instead. Desktop splits into a
// form-left / live-roster-right arrangement inside the one Card, mobile
// stacks the same two sections. A Diner exists only as a name on this Bill
// (CONTEXT.md) — removing one strips their Shares from every Line Item so
// nothing on the Bill can reference someone who isn't there.
export function DinerSetupScreen({ bill, onBillChange, onContinue }: DinerSetupScreenProps) {
  const [nameDraft, setNameDraft] = useState('')
  const [remembered, setRemembered] = useState(() => loadRememberedDinerNames())

  // Names already on this Bill are dropped from the remembered-chip row —
  // tapping a name already seated would just create a same-named duplicate
  // Diner, which the one-tap chip is not meant to invite.
  const currentNames = new Set(bill.diners.map((d) => d.name))
  const rememberedToShow = remembered.filter((name) => !currentNames.has(name))
  // A Diner exists only as a name (CONTEXT.md) — a blank one, however
  // transiently reached mid-edit, must never carry forward into Assignment.
  const hasBlankName = bill.diners.some((d) => !d.name.trim())

  function addDiner(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    onBillChange({ ...bill, diners: [...bill.diners, newDiner(trimmed, bill.diners)] })
    rememberDinerName(trimmed)
    setRemembered(loadRememberedDinerNames())
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    addDiner(nameDraft)
    setNameDraft('')
  }

  function handleForget(name: string) {
    forgetDinerName(name)
    setRemembered(loadRememberedDinerNames())
  }

  function handleRename(id: DinerId, name: string) {
    onBillChange({ ...bill, diners: bill.diners.map((d) => (d.id === id ? { ...d, name } : d)) })
  }

  function handleRemove(id: DinerId) {
    onBillChange({
      ...bill,
      diners: bill.diners.filter((d) => d.id !== id),
      lineItems: bill.lineItems.map((item) => {
        if (!(id in item.shares)) return item
        const shares = { ...item.shares }
        delete shares[id]
        return { ...item, shares }
      }),
      payerId: bill.payerId === id ? undefined : bill.payerId,
    })
  }

  function handleTogglePayer(id: DinerId) {
    onBillChange({ ...bill, payerId: bill.payerId === id ? undefined : id })
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pb-28 lg:p-6 lg:pb-6">
      <Card>
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Form column — mockup's form-left half of the split. The lg:border-r
              divider is the same one bordered/shadowed Card, not two stacked
              ones, matching the mockup's single box with an internal rule. */}
          <div className="flex flex-col lg:flex-1 lg:border-r lg:border-pure-black lg:pr-8">
            <h2 className="text-headline-sm uppercase text-on-surface">{copy.dinerSetup.heading}</h2>

            {rememberedToShow.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                <p className="text-label-sm uppercase text-on-surface-variant">{copy.dinerSetup.rememberedHeading}</p>
                <div className="flex flex-wrap gap-2">
                  {rememberedToShow.map((name) => (
                    <NameChip key={name} name={name} onAdd={() => addDiner(name)} onForget={() => handleForget(name)} />
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 flex items-end gap-3">
              <div className="flex-1">
                <TextField
                  label={copy.dinerSetup.nameField}
                  placeholder={copy.dinerSetup.namePlaceholder}
                  value={nameDraft}
                  onChange={(event) => setNameDraft(event.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary" disabled={!nameDraft.trim()}>
                {copy.dinerSetup.addDiner}
              </Button>
            </form>
          </div>

          {/* Roster column — mockup's live-roster-right half, current Diners as
              full-width rows carrying their own diner-N fill (docs/design mockup
              §6) rather than the old grid of neutral cards. */}
          <div className="flex flex-col lg:w-[320px] lg:shrink-0">
            {bill.diners.length === 0 ? (
              <p className="mt-6 py-4 text-body-md text-on-surface-variant lg:mt-0">{copy.dinerSetup.dinersEmpty}</p>
            ) : (
              <>
                <p className="mt-6 text-label-sm uppercase text-on-surface-variant lg:mt-0">
                  {copy.dinerSetup.currentDinersHeading}
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {bill.diners.map((diner) => {
                    const isPayer = bill.payerId === diner.id
                    return (
                      // Name field on its own line, Payer control + remove
                      // below — the row's fixed-width controls plus a usable
                      // rename field don't fit on one line at narrow widths
                      // (or this column's own 320px desktop width), same
                      // reasoning as AssignmentLineItemRow's two-line split.
                      <div
                        key={diner.id}
                        className={`flex flex-col gap-2 border border-pure-black p-3 shadow-sm ${dinerFillClass(diner.joinIndex)}`}
                      >
                        <TextField
                          label={`${copy.dinerSetup.renameDiner} — ${diner.name}`}
                          hideLabel
                          value={diner.name}
                          onChange={(event) => handleRename(diner.id, event.target.value)}
                        />
                        <div className="flex items-center justify-between gap-2">
                          {isPayer ? (
                            <PayerRibbon
                              joinIndex={diner.joinIndex}
                              onClick={() => handleTogglePayer(diner.id)}
                              label={`${copy.dinerSetup.unmarkAsPayer} — ${diner.name}`}
                            />
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleTogglePayer(diner.id)}
                              aria-label={`${copy.dinerSetup.markAsPayer} — ${diner.name}`}
                              className={`border border-pure-black px-2 py-1 text-label-sm text-on-surface ${focusRing}`}
                            >
                              {copy.dinerSetup.markAsPayer}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemove(diner.id)}
                            aria-label={`${copy.dinerSetup.removeDiner} ${diner.name}`}
                            className={`p-1 text-on-surface ${focusRing}`}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </Card>

      <Button variant="primary" onClick={onContinue} disabled={bill.diners.length === 0 || hasBlankName}>
        {copy.dinerSetup.continueToAssignment}
      </Button>
    </div>
  )
}
