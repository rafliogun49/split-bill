import { z } from 'zod'

// Validates the model's raw JSON output against the parse contract
// (ADR-0006). Every monetary field is an integer — a decimal here means the
// model ignored the prompt's separator rule, and it must be rejected rather
// than coerced, so a scaling error never reaches the review screen quietly.
export const parsedBillSchema = z.object({
  currency: z.string().length(3),
  placeName: z.string().min(1).optional(),
  date: z.string().min(1).optional(),
  lineItems: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number(),
      total: z.number().int(),
    }),
  ),
  adjustments: z.array(
    z.object({
      label: z.string().min(1),
      amount: z.number().int(),
    }),
  ),
  printedTotal: z.number().int().optional(),
})
