// DESIGN.md "Diner scale": diner-{(index % 6) + 1}. Literal class names (not
// template-built) so Tailwind's content scan can see every diner-N utility —
// shared by every component that fills with a Diner's colour, so the scale
// can't drift between them.
const dinerFillClasses = ['bg-diner-1', 'bg-diner-2', 'bg-diner-3', 'bg-diner-4', 'bg-diner-5', 'bg-diner-6'] as const

export function dinerFillClass(joinIndex: number): string {
  return dinerFillClasses[joinIndex % dinerFillClasses.length]!
}
