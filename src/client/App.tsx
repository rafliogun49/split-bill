import { useState } from 'react'
import type { Bill } from '../domain'
import { Card } from './components/Card'
import { TopBar } from './components/TopBar'
import { copy } from './copy'
import { clearBill, loadBill } from './persistence/billStorage'
import { StartScreen } from './screens/StartScreen'

type Screen = 'start' | 'in-progress'

// The remaining screens (Capture, Bill editor, Diner setup, Assignment,
// Summary) land in later issues — this is a holding screen so the Start ->
// Resume loop is demonstrable end to end before they exist.
function InProgressPlaceholder() {
  return (
    <Card>
      <p className="text-body-md text-on-surface">{copy.inProgressPlaceholder}</p>
    </Card>
  )
}

export function App() {
  const [bill, setBill] = useState<Bill | null>(() => loadBill())
  const [screen, setScreen] = useState<Screen>('start')

  function handleNewBill() {
    clearBill()
    setBill(null)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar onExit={screen === 'in-progress' ? () => setScreen('start') : undefined} />
      <main className="flex flex-1 items-center justify-center p-6">
        {screen === 'start' ? (
          <StartScreen
            hasActiveBill={bill !== null}
            onPhotograph={() => setScreen('in-progress')}
            onEnterManually={() => setScreen('in-progress')}
            onResume={() => setScreen('in-progress')}
            onNewBill={handleNewBill}
          />
        ) : (
          <InProgressPlaceholder />
        )}
      </main>
    </div>
  )
}
