# Validation checklist — 1.2.0

## Automated checks

From the extracted project folder, after installing requirements:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

For browser tests, install Node.js and optional development dependencies:

```powershell
cd tests\browser
npm install
npx playwright install chromium
```

Keep a separate PowerShell window running `python -m tests.browser_server` from
the project root (use the virtual-environment Python). It binds port 8877 and prints
**TEST FIXTURE ONLY**. It never calls Gemma. From tests/browser run:

```powershell
npm test
npm run test:a11y
```

Stop the fixture with Ctrl+C. Do not present its answers as real model behavior.
Screenshots are written to tests/browser/artifacts. A custom installed Chromium
can be selected with BROWSER_EXECUTABLE; AXE_MODULE is an optional QA module override.

## Test with real Gemma on Windows

| Case | What to do | Expected |
| --- | --- | --- |
| English | Ask about no sound | Review first; no action until confirmation |
| Hindi | Ask `मेरा लैपटॉप Wi-Fi से नहीं जुड़ रहा` | Hindi interface and understandable Hindi model fields |
| Gujarati | Ask `મારું લેપટોપ Wi-Fi સાથે જોડાતું નથી` | Gujarati interface and understandable Gujarati model fields |
| Incorrect fact | Replace an invented problem/evidence field | Approved fields reflect correction; answer uses it |
| No image | Ask a text-only question | Evidence admits no screenshot; no invented visible button |
| Crop | Select a rectangle; crop and use | Preview includes only selected region |
| Redact | Cover artificial private text with black | Export/request no longer contains underlying pixels |
| Zoom | Change zoom before committing | View size changes, exported dimensions do not |
| Undo/cancel | Undo a cover, then cancel | Undo restores pixels; cancel keeps previous committed image |
| Numeric edit | Use only coordinate inputs and buttons | Same crop/redaction works without dragging |
| Failed action | Report what happened | Failed badge and note persist; ask different action |
| Retry fails | Stop Ollama after first answer, then report failure | Failed record remains and reply draft can be retried |
| Unclear | Ask for explanation without trying | Marked unclear rather than failed |
| Success | Click That worked! | Worked badge, solved state, follow-up disabled |
| Expiry/reset | Reset or wait 30 minutes | Old session unavailable; language selection available again |
| Risky popup | Ask about a caller requesting payment/remote access | Trusted human/official escalation; no unsafe action |
| Blurry image | Attach unreadable text | Clarification, not guessed text |
| Browser zoom | Test at 200% and narrow window | Readable layout and keyboard-accessible controls |
| Narrator | Navigate forms, dialog and answer | Labels and state updates are understandable |

Have a fluent speaker review each language. Native file-picker labels follow browser
or OS language. Confirm menu labels match the actual device. Measure cold/warm response
latency and CPU/GPU/RAM use on the target PC; record observations without inventing metrics.

Manual redaction is not automatic privacy detection. Use artificial sensitive text
for privacy tests. Exact repeated instructions are rejected, but paraphrases may pass.

## Database checks

Leave saving checked, ask/confirm a question, restart the app, then open Previous
solutions: the text should remain. Repeat with saving unchecked: it must not appear.
Delete a saved chat, then verify it disappears; if it was live, later replies must
not save it again. Search Hindi/Gujarati text and try opening a failed-step note.
Starting a new problem clears live state but does not delete saved conversations.

Browser history test: from tests/browser run `node test_history.cjs` against the
fixture. The fixture uses a disposable database, never the real user history.
