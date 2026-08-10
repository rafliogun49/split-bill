// DESIGN.md "Diner scale": diner-{(index % 6) + 1}. Literal class names (not
// template-built) so Tailwind's content scan can see every diner-N utility —
// shared by every component that fills with a Diner's colour, so the scale
// can't drift between them.
const dinerFillClasses = ['bg-diner-1', 'bg-diner-2', 'bg-diner-3', 'bg-diner-4', 'bg-diner-5', 'bg-diner-6'] as const

export function dinerFillClass(joinIndex: number): string {
  return dinerFillClasses[joinIndex % dinerFillClasses.length]!
}

// Text-ink counterpart of dinerFillClass, for a Diner's colour used as ink
// on a dark ground instead of as a fill — DinerSetupScreen's Payer ribbon
// (docs/design mockup §6): black tag, diner-N coloured "PAYER" text. Same
// literal-class rationale as dinerFillClasses above.
const dinerTextClasses = ['text-diner-1', 'text-diner-2', 'text-diner-3', 'text-diner-4', 'text-diner-5', 'text-diner-6'] as const

export function dinerTextClass(joinIndex: number): string {
  return dinerTextClasses[joinIndex % dinerTextClasses.length]!
}
