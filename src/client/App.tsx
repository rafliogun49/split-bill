import { useState } from 'react'
import type { Bill } from '../domain'
import type { ParseFailureReason, ParseReconciliation, ParsedReceipt } from './ai/parseReceiptClient'
import { parsedReceiptToBill } from './ai/parsedReceiptToBill'
import { TopBar } from './components/TopBar'
import { clearBill, loadBill, saveBill } from './persistence/billStorage'
import { AssignmentScreen } from './screens/AssignmentScreen'
import { BillEditorScreen } from './screens/BillEditorScreen'
import { CaptureScreen } from './screens/CaptureScreen'
import { DinerSetupScreen } from './screens/DinerSetupScreen'
import { ParseFailureScreen } from './screens/ParseFailureScreen'
import { ParsingScreen } from './screens/ParsingScreen'
import { StartScreen } from './screens/StartScreen'
import { SummaryScreen } from './screens/SummaryScreen'

type Screen = 'start' | 'capture' | 'parsing' | 'parse-failure' | 'editor' | 'diner-setup' | 'assignment' | 'summary'

// Manual entry always starts in the Bill currency worked throughout
// DESIGN.md; the editor's own currency selector corrects it from there.
function emptyBill(): Bill {
  return { currency: { code: 'IDR' }, diners: [], lineItems: [], adjustments: [] }
}

export function App() {
  const [bill, setBill] = useState<Bill | null>(() => loadBill())
  const [screen, setScreen] = useState<Screen>('start')
  const [capturedFile, setCapturedFile] = useState<File | null>(null)
  const [parseFailureReason, setParseFailureReason] = useState<ParseFailureReason | null>(null)
  const [reconciliation, setReconciliation] = useState<ParseReconciliation | undefined>(undefined)

  function handleNewBill() {
    clearBill()
    setBill(null)
    setReconciliation(undefined)
  }

  function handleEnterManually() {
    const next = bill ?? emptyBill()
    setBill(next)
    saveBill(next)
    setReconciliation(undefined)
    setScreen('editor')
  }

  function handleBillChange(next: Bill) {
    setBill(next)
    saveBill(next)
  }

  function handleCapture(file: File) {
    setCapturedFile(file)
    setScreen('parsing')
  }

  function handleParsed(receipt: ParsedReceipt) {
    const next = parsedReceiptToBill(receipt)
    setBill(next)
    saveBill(next)
    setReconciliation(receipt.reconciliation)
    setCapturedFile(null)
    setScreen('editor')
  }

  function handleParseFailure(reason: ParseFailureReason) {
    setCapturedFile(null)
    setParseFailureReason(reason)
    setScreen('parse-failure')
  }

  function handleParsingCancelled() {
    setCapturedFile(null)
    setScreen('capture')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar onExit={screen !== 'start' ? () => setScreen('start') : undefined} />
      <main className="flex flex-1 flex-col">
        {screen === 'start' ? (
          <StartScreen
            hasActiveBill={bill !== null}
            onPhotograph={() => setScreen('capture')}
            onEnterManually={handleEnterManually}
            onResume={() => setScreen('editor')}
            onNewBill={handleNewBill}
          />
        ) : screen === 'capture' ? (
          <CaptureScreen onCapture={handleCapture} onEnterManually={handleEnterManually} />
        ) : screen === 'parsing' && capturedFile ? (
          <ParsingScreen
            file={capturedFile}
            onParsed={handleParsed}
            onFailure={handleParseFailure}
            onCancel={handleParsingCancelled}
          />
        ) : screen === 'parse-failure' && parseFailureReason ? (
          <ParseFailureScreen
            reason={parseFailureReason}
            onRetry={() => setScreen('capture')}
            onEnterManually={handleEnterManually}
          />
        ) : screen === 'editor' && bill ? (
          <BillEditorScreen
            bill={bill}
            onBillChange={handleBillChange}
            onContinue={() => setScreen('diner-setup')}
            reconciliation={reconciliation}
          />
        ) : screen === 'diner-setup' && bill ? (
          <DinerSetupScreen bill={bill} onBillChange={handleBillChange} onContinue={() => setScreen('assignment')} />
        ) : screen === 'assignment' && bill ? (
          <AssignmentScreen bill={bill} onBillChange={handleBillChange} onContinue={() => setScreen('summary')} />
        ) : screen === 'summary' && bill ? (
          <SummaryScreen bill={bill} />
        ) : null}
      </main>
    </div>
  )
}
