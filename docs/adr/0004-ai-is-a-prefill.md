# AI parsing is a pre-fill, never a dependency

There is one Bill editor. Manual entry opens it empty, a parsed receipt opens it pre-populated, and a failed parse opens it empty with an apology. The post-parse review step is not a separate screen — it *is* the editor. Receipt parsing is a way of saving typing, and nothing else.

The brief framed these as two branches ("AI analyzes it" *or* "if user doesn't have receipt, just let them insert"), but they converge: the review step needs every row editable, a failed parse needs somewhere to land, and manual entry needs the same row-editing affordances. Three doors, one room.

## Consequences

- The app is fully usable when OpenRouter is down, over its spend cap, or handed an unreadable photo. AI degrades to a convenience; it is never on the critical path.
- Row-editing interactions are built, styled, and tested once instead of twice, and cannot drift between the two flows.
- Build order follows from this: the editor and the domain layer come first, and parsing is added last as an enhancement to an already-working app.
- Parse output must therefore conform to exactly the same Bill shape the editor produces by hand — the AI gets no privileged representation.
