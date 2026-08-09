# A layered pure core, not literal MVC

The original brief asked for "MVC pattern". We deliberately did not build `models/`, `views/`, and `controllers/`. **If you are about to "restore" MVC because the spec mentions it, read this first — the deviation is intentional.**

MVC is a server-rendering pattern: a Controller receives a request, a Model queries a database, a View renders HTML. On this stack none of those three hold. There is no database ([ADR-0001](./0001-client-only-state.md)), so the Model layer has nothing to model against; React already owns rendering, so a View layer would be a second, redundant one; and the server has a single route, so a Controller layer would be one file in an otherwise empty folder. Worse, literal MVC gives no guidance at all about the client — which is where essentially all the logic lives.

What the brief actually wanted was separation of concerns: keep the arithmetic out of the components. We get that from a pure core instead:

- **`src/domain/`** — plain TypeScript. No React, no `fetch`, no Hono, no I/O. `calculateSplit(bill)` is a pure function. This is the "Model" in the only sense that matters here.
- **`src/server/`** — Hono. Validates input, calls OpenRouter, returns JSON. Holds no business rules.
- **`src/client/`** — React. Renders state and dispatches intent. Contains no money arithmetic.

## Consequences

- The domain layer is unit-testable with zero mocking, which is why the test strategy concentrates there.
- Money arithmetic appearing in a component or a route handler is a defect, not a shortcut.
- The domain layer has no dependency on the browser, so moving persistence server-side later would not touch it.
