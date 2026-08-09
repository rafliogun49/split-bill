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
    howItWorksTitle: 'How it works',
    howItWorks: [
      {
        title: 'Photograph the receipt',
        body: 'Snap a photo, or enter items by hand. Either way, nothing leaves your device.',
      },
      {
        title: 'Tag who had what',
        body: 'Assign each Line Item to a Diner. Shared plates split between everyone with a tap.',
      },
      {
        title: 'Get your Split',
        body: 'Adjustments are shared pro-rata by what each Diner ordered — automatically, every time.',
      },
    ],
    featuresTitle: 'Why Split Bill',
    features: [
      {
        title: 'Nothing stored',
        body: 'No accounts, no server holding your Bill. It exists only on this device.',
      },
      {
        title: 'Fair by default',
        body: 'The Split accounts for exactly what each Diner ordered, not an even share.',
      },
      {
        title: 'No sign-up',
        body: 'Open it and start. No account, no install, nothing to wait on.',
      },
    ],
    footerTagline: 'No accounts. Nothing leaves your device.',
  },
} as const
