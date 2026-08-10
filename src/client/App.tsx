import type { ReactNode } from 'react'
import { useRef, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router'
import type { Bill } from '../domain'
import type { ParseFailureReason, ParseReconciliation, ParsedReceipt } from './ai/parseReceiptClient'
import { parsedReceiptToBill } from './ai/parsedReceiptToBill'
import { TopBar } from './components/TopBar'
import { clearBill, loadBill, saveBill } from './persistence/billStorage'
import { redirectWhenMissing } from './routing/guards'
import { paths } from './routing/paths'
import { AssignmentScreen } from './screens/AssignmentScreen'
import { BillEditorScreen } from './screens/BillEditorScreen'
import { CaptureScreen } from './screens/CaptureScreen'
import { DinerSetupScreen } from './screens/DinerSetupScreen'
import { ParseFailureScreen } from './screens/ParseFailureScreen'
import { ParsingScreen } from './screens/ParsingScreen'
import { StartScreen } from './screens/StartScreen'
import { SummaryScreen } from './screens/SummaryScreen'

// Manual entry always starts in the Bill currency worked throughout
// DESIGN.md; the editor's own currency selector corrects it from there.
function emptyBill(): Bill {
  return { currency: { code: 'IDR' }, diners: [], lineItems: [], adjustments: [] }
}

// Renders `children(value)` when `value` is present, or redirects to
// `fallback` otherwise (ADR-0009: the guard that used to live in App.tsx's
// `screen === 'editor' && bill`-style conditionals now lives at the route
// level). `redirectWhenMissing` is the pure decision, unit-tested on its own.
//
// The redirect only fires based on the value seen when this route was first
// entered — not on every render. A screen that owns its guarding value
// (Parsing's capturedFile, ParseFailure's reason) clears it in the same
// handler that navigates away, and those two state updates can land in
// separate renders; without this, a transient render can see `value: null`
// while still matched on the old route and fire its own redirect, racing
// the real navigation and stranding the user back on `fallback` instead
// (e.g. a successful parse bouncing back to Capture instead of reaching the
// Bill editor). Once mounted with a value, the last known value keeps
// rendering through that race — the route is about to unmount anyway.
function Guarded<T>({ value, fallback, children }: { value: T | null; fallback: string; children: (value: T) => ReactNode }) {
  const hadValueOnMount = useRef(redirectWhenMissing(value, fallback) === null)
  const lastValue = useRef(value)
  if (value !== null) lastValue.current = value

  if (!hadValueOnMount.current) return <Navigate to={fallback} replace />
  return <>{children(lastValue.current as T)}</>
}

function AppShell() {
  const [bill, setBill] = useState<Bill | null>(() => loadBill())
  const [capturedFile, setCapturedFile] = useState<File | null>(null)
  const [parseFailureReason, setParseFailureReason] = useState<ParseFailureReason | null>(null)
  const [reconciliation, setReconciliation] = useState<ParseReconciliation | undefined>(undefined)
  const navigate = useNavigate()
  const location = useLocation()

  function handleNewBill() {
    clearBill()
    setBill(null)
    setReconciliation(undefined)
  }

  // `replace` lets callers leaving a transient, guarded screen (ParseFailure)
  // collapse its history entry into the destination instead of stacking on
  // top of it — same reasoning as every exit from Parsing below. Start and
  // Capture aren't guarded/transient, so their calls omit it and push as a
  // normal screen transition.
  function handleEnterManually(options?: { replace?: boolean }) {
    const next = bill ?? emptyBill()
    setBill(next)
    saveBill(next)
    setReconciliation(undefined)
    navigate(paths.bill, { replace: options?.replace })
  }

  function handleBillChange(next: Bill) {
    setBill(next)
    saveBill(next)
  }

  // Capture -> Parsing is a history *replacement*: Capture with a picked
  // file is a transient hop, not a screen worth keeping as its own
  // back-stop (ADR-0009).
  function handleCapture(file: File) {
    setCapturedFile(file)
    navigate(paths.parsing, { replace: true })
  }

  // Every way out of Parsing (success, failure, cancel) also replaces —
  // Parsing itself is never a stable back-target, since there's no
  // in-flight request left to resume once you've left it.
  function handleParsed(receipt: ParsedReceipt) {
    const next = parsedReceiptToBill(receipt)
    setBill(next)
    saveBill(next)
    setReconciliation(receipt.reconciliation)
    setCapturedFile(null)
    navigate(paths.bill, { replace: true })
  }

  function handleParseFailure(reason: ParseFailureReason) {
    setCapturedFile(null)
    setParseFailureReason(reason)
    navigate(paths.parseFailure, { replace: true })
  }

  function handleParsingCancelled() {
    setCapturedFile(null)
    navigate(paths.capture, { replace: true })
  }

  // Both ways out of the parse-failure screen (Retry, Enter manually) clear
  // the reason and replace — same non-resumable treatment as Parsing itself,
  // so a later browser back can't resurrect an already-superseded failure
  // over a Bill that's since moved on (ADR-0009).
  function handleRetryAfterParseFailure() {
    setParseFailureReason(null)
    navigate(paths.capture, { replace: true })
  }

  function handleEnterManuallyAfterParseFailure() {
    setParseFailureReason(null)
    handleEnterManually({ replace: true })
  }

  const onExit = location.pathname !== paths.start ? () => navigate(paths.start) : undefined

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar onExit={onExit} />
      <main className="flex flex-1 flex-col">
        <Routes>
          <Route
            path={paths.start}
            element={
              <StartScreen
                hasActiveBill={bill !== null}
                onPhotograph={() => navigate(paths.capture)}
                onEnterManually={handleEnterManually}
                onResume={() => navigate(paths.bill)}
                onNewBill={handleNewBill}
              />
            }
          />

          <Route
            path={paths.capture}
            element={<CaptureScreen onCapture={handleCapture} onEnterManually={handleEnterManually} />}
          />

          <Route
            path={paths.parsing}
            element={
              <Guarded value={capturedFile} fallback={paths.capture}>
                {(file) => (
                  <ParsingScreen file={file} onParsed={handleParsed} onFailure={handleParseFailure} onCancel={handleParsingCancelled} />
                )}
              </Guarded>
            }
          />

          <Route
            path={paths.parseFailure}
            element={
              <Guarded value={parseFailureReason} fallback={paths.capture}>
                {(reason) => (
                  <ParseFailureScreen
                    reason={reason}
                    onRetry={handleRetryAfterParseFailure}
                    onEnterManually={handleEnterManuallyAfterParseFailure}
                  />
                )}
              </Guarded>
            }
          />

          <Route
            path={paths.bill}
            element={
              <Guarded value={bill} fallback={paths.start}>
                {(activeBill) => (
                  <BillEditorScreen
                    bill={activeBill}
                    onBillChange={handleBillChange}
                    onContinue={() => navigate(paths.diners)}
                    reconciliation={reconciliation}
                  />
                )}
              </Guarded>
            }
          />

          <Route
            path={paths.diners}
            element={
              <Guarded value={bill} fallback={paths.start}>
                {(activeBill) => (
                  <DinerSetupScreen bill={activeBill} onBillChange={handleBillChange} onContinue={() => navigate(paths.assignment)} />
                )}
              </Guarded>
            }
          />

          <Route
            path={paths.assignment}
            element={
              <Guarded value={bill} fallback={paths.start}>
                {(activeBill) => (
                  <AssignmentScreen bill={activeBill} onBillChange={handleBillChange} onContinue={() => navigate(paths.summary)} />
                )}
              </Guarded>
            }
          />

          <Route
            path={paths.summary}
            element={
              <Guarded value={bill} fallback={paths.start}>
                {(activeBill) => <SummaryScreen bill={activeBill} />}
              </Guarded>
            }
          />

          <Route path="*" element={<Navigate to={paths.start} replace />} />
        </Routes>
      </main>
    </div>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
