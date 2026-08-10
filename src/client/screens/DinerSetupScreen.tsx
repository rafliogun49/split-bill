import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Bill, Diner, DinerId } from '../../domain'
import { copy } from '../copy'
import { TrashIcon } from '../icons'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { DinerChip } from '../components/DinerChip'
import { focusRing } from '../components/focusRing'
import { NameChip } from '../components/NameChip'
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

// DESIGN.md screen 7: remembered NameChips above a text field, current
// Diners as removable diner-N chips, one markable as Payer. A Diner exists
// only as a name on this Bill (CONTEXT.md) — removing one strips their
// Shares from every Line Item so nothing on the Bill can reference someone
// who isn't there.
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

        {bill.diners.length === 0 ? (
          <p className="mt-6 py-4 text-body-md text-on-surface-variant">{copy.dinerSetup.dinersEmpty}</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {bill.diners.map((diner) => {
              const isPayer = bill.payerId === diner.id
              return (
                <div
                  key={diner.id}
                  className="flex flex-col gap-3 border border-pure-black bg-surface-container-lowest p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <DinerChip name={diner.name} joinIndex={diner.joinIndex} isPayer={isPayer} />
                    <button
                      type="button"
                      onClick={() => handleRemove(diner.id)}
                      aria-label={`${copy.dinerSetup.removeDiner} ${diner.name}`}
                      className={`p-2 text-on-surface ${focusRing}`}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <TextField
                    label={`${copy.dinerSetup.renameDiner} — ${diner.name}`}
                    hideLabel
                    value={diner.name}
                    onChange={(event) => handleRename(diner.id, event.target.value)}
                  />
                  <Button
                    variant={isPayer ? 'primary' : 'secondary'}
                    aria-pressed={isPayer}
                    aria-label={`${isPayer ? copy.dinerSetup.unmarkAsPayer : copy.dinerSetup.markAsPayer} — ${diner.name}`}
                    onClick={() => handleTogglePayer(diner.id)}
                  >
                    {isPayer ? copy.dinerSetup.unmarkAsPayer : copy.dinerSetup.markAsPayer}
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      <Button variant="primary" onClick={onContinue} disabled={bill.diners.length === 0 || hasBlankName}>
        {copy.dinerSetup.continueToAssignment}
      </Button>
    </div>
  )
}
