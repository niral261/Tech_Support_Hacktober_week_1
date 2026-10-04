# Release verification — 1.2.0

| Check | Environment | Result |
| --- | --- | --- |
| Backend/domain/HTTP suite | Python 3.12, Pillow 12.3.0 | 55 tests passed |
| Backend/domain/HTTP suite | Python 3.12, Pillow 10.4.0 | 55 tests passed |
| Browser workflow and pixel checks | Linux Chromium, deterministic model double | Passed |
| Layout/font inspection | Desktop 1280 px; narrow 390 px; Hindi/Gujarati | Passed visual review; no narrow overflow |
| Automated axe scans | Describe in en/hi/gu; review, answer, editor and saved-history dialogs | No violations for selected WCAG A/AA rules |
| Ruff / source formatting | Python and frontend source | Passed |
| PDF structure and rendered-page inspection | 34 pages; editable vector diagrams | Reviewed; all 14 UML types and architecture included |

Browser checks prove edited PNG dimensions and black pixel values, compare outbound
image bytes to the edited image, and confirm opening an editor does not analyze the
original. They also cover review/correction, failed-note persistence after rejected
repeat, synthetic different-action retry, solve/reset, catalog parity, native modal
Escape and corrupt image rejection. The fixtures are not model-language tests.

Target-PC Windows launcher execution, actual Gemma screen understanding, Hindi/Gujarati
fluency, latency/VRAM use, Windows Narrator and recipient feedback remain to be tested
on the user’s PC. Automated accessibility scans are partial checks, not certification.

SQLite checks add 12 tests covering restart/reset survival, opt-out, no image
serialization, outcomes, model/database failures, active archive deletion, literal
Unicode search/injection strings, paging, input validation, TTL and schema version.
Browser history checks cover save/reopen, failed notes, delete, opt-out, plain-text
rendering and a disabled-button startup fallback if an editor script fails to load.
