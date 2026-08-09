import { useState } from 'react'
import type { Bill } from '../domain'
import { Card } from './components/Card'
import { TopBar } from './components/TopBar'
import { copy } from './copy'
import { clearBill, loadBill, saveBill } from './persistence/billStorage'
import { AssignmentScreen } from './screens/AssignmentScreen'
import { BillEditorScreen } from './screens/BillEditorScreen'
import { DinerSetupScreen } from './screens/DinerSetupScreen'
import { StartScreen } from './screens/StartScreen'
import { SummaryScreen } from './screens/SummaryScreen'

type Screen = 'start' | 'editor' | 'diner-setup' | 'assignment' | 'summary' | 'in-progress'

// Capture (issue #11, AI parsing) lands in a later issue — this is a holding
// screen so the Photograph entry point is demonstrable before parsing exists.
function InProgressPlaceholder() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card>
        <p className="text-body-md text-on-surface">{copy.inProgressPlaceholder}</p>
      </Card>
    </div>
  )
}

// Manual entry always starts in the Bill currency worked throughout
// DESIGN.md; the editor's own currency selector corrects it from there.
function emptyBill(): Bill {
  return { currency: { code: 'IDR' }, diners: [], lineItems: [], adjustments: [] }
}

export function App() {
  const [bill, setBill] = useState<Bill | null>(() => loadBill())
  const [screen, setScreen] = useState<Screen>('start')

  function handleNewBill() {
    clearBill()
    setBill(null)
  }

  function handleEnterManually() {
    const next = bill ?? emptyBill()
    setBill(next)
    saveBill(next)
    setScreen('editor')
  }

  function handleBillChange(next: Bill) {
    setBill(next)
    saveBill(next)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar onExit={screen !== 'start' ? () => setScreen('start') : undefined} />
      <main className="flex flex-1 flex-col">
        {screen === 'start' ? (
          <StartScreen
            hasActiveBill={bill !== null}
            onPhotograph={() => setScreen('in-progress')}
            onEnterManually={handleEnterManually}
            onResume={() => setScreen('editor')}
            onNewBill={handleNewBill}
          />
        ) : screen === 'editor' && bill ? (
          <BillEditorScreen bill={bill} onBillChange={handleBillChange} onContinue={() => setScreen('diner-setup')} />
        ) : screen === 'diner-setup' && bill ? (
          <DinerSetupScreen bill={bill} onBillChange={handleBillChange} onContinue={() => setScreen('assignment')} />
        ) : screen === 'assignment' && bill ? (
          <AssignmentScreen bill={bill} onBillChange={handleBillChange} onContinue={() => setScreen('summary')} />
        ) : screen === 'summary' && bill ? (
          <SummaryScreen bill={bill} />
        ) : (
          <InProgressPlaceholder />
        )}
      </main>
    </div>
  )
}
