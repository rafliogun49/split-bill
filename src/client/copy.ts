// Every user-facing string in the app lives here — DESIGN.md §7 and
// CONTEXT.md's glossary are enforced by having exactly one place strings can
// drift from them. No component may inline a string literal for copy.

export const copy = {
  wordmark: 'Split Bill',
  topBar: {
    exit: 'Exit',
  },
  inProgressPlaceholder: 'Screens land in later issues.',
  start: {
    tagline: 'Photograph the receipt. Tag who had what.',
    photographReceipt: 'Photograph receipt',
    enterManually: 'Enter manually',
    photoNeverStored: 'Your photo is never stored.',
    resume: 'Resume',
    newBill: 'New Bill',
    newBillWarningTitle: "This discards the Bill you're working on",
    newBillWarningBody: 'Starting a New Bill discards the current Bill. This cannot be undone.',
    confirmNewBill: 'Discard and start new',
    cancelNewBill: 'Cancel',
  },
} as const
