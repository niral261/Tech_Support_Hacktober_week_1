# System design — 1.2.0

The app is a local monolith with browser presentation, an HTTP boundary, an
application service, immutable domain values and infrastructure adapters. See
the separately delivered 34-page technical guide for all fourteen UML diagram
views and detailed explanations. Its editable drawings/text are in
`tools/build_technical_pdf.py`.

## Patterns

- **Layering:** server/controller handle HTTP; SupportService owns workflow.
- **Repository:** SessionRepository owns temporary snapshots, TTL and versions.
- **Adapter:** OllamaClient isolates model HTTP; ModelClient enables FakeModel.
- **Constructor injection:** Application connects collaborators explicitly.
- **Immutable values:** frozen dataclasses and replacement commits simplify state.
- **Optimistic concurrency:** every commit checks the caller’s expected version.

SQLite now saves optional text snapshots. No additional web framework, message queue or microservice is needed.

## New state transitions

Creation → analysis draft → optional user correction → confirmation plus first
answer → follow-ups/outcomes → explicit solve or reset/expiry. Analyze and confirm
are separate model calls. Correction stores user fields without another model call.
An error leaves the persisted draft/history intact; confirmation commits only after
validating an answer. Feedback commits separately before retrying inference.

The service has one nonblocking inference lock across sessions. Repository map and
version operations use a separate lock, which is not held during model calls.
Late results cannot recreate a reset session. Expiry is lazy on repository activity.

## Screenshot boundary

The browser decodes a file, scales its working canvas to at most 2,400 pixels per
edge, and modifies real pixels. Crop discards outside pixels; solid black covers
replace selected pixels. Zoom only affects display. Three undo snapshots stay in
browser memory. Commit exports a PNG under 5 MB. Python validates/rebuilds it as a
metadata-free JPEG, longest edge 1,600 pixels. The initial sanitized image remains
only in a draft until confirmation; later images are turn-local. Original files
are unchanged. Logical clearing does not promise forensic erasure.

## Language and prompt bounds

Sessions use en/hi/gu; device API values remain canonical. Complete translation
catalogs and local Noto Indic fonts support the interface. Prompts request the
selected language while preserving actual menu labels. Full records remain in
memory; compact failed summaries use 100 action characters and 60 note characters.
Essential context plus first/recent complete exchanges fit a 6,500-character budget.
Character budgets approximate token use; non-English text/images can still exhaust
model context. JSON schemas check shape, not truth or safe advice.

## Limits and trade-offs

20 sessions, 30-minute idle TTL, ten answers, 4,096 context tokens, 384 output tokens,
240-second model timeout, one inference at a time. Actual target-PC performance and
language quality need real Gemma tests. Exact repeat detection does not recognize
all semantic equivalents. Language changes require a new session. Approved fields
can be corrected before the first step; later clarifications are ordinary replies.

Version conflict after an ambiguous network error currently requires reset. A
future session-refresh route is a useful recovery improvement. Durable history,
authentication and LAN use would require separate design decisions.

## SQLite archive

HistoryRepository uses one connection/transaction per operation and schema version 1.
Opted-in mutations write a whitelisted JSON text snapshot to `conversations` before
replacing RAM state. Session IDs are unique; metadata supports listing and search.
There is no screenshot column. Archives survive reset, expiry and restart. Deleting
a live archive disables saving for it and advances its version. Saved views are
read-only; model prompts never automatically include another chat's saved advice.
The file is under the local user data directory, outside the extracted project.
It is not app-encrypted, and deletion does not guarantee forensic erasure.
