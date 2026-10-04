# API contract — 1.2.0

Local origin: `http://127.0.0.1:8765`. POST requests require `application/json`,
a matching local Origin and valid Host. Every summary exposes `session_id`,
`device`, `language`, `version`, `turn_count`, `solved`, `confirmed`,
`understanding` and `attempts`. Image bytes are never returned in summaries.

| Route | Body | Behavior |
| --- | --- | --- |
| POST `/api/sessions` | `device`, optional `language` (en default; hi, gu), `save_history` (boolean, false if omitted) | Creates version 0 |
| POST `/api/analyze` | ID, version, message, optional base64 image | Draft understanding; version +1; no action |
| POST `/api/correct` | ID, version, `understanding` object | User replacement of all three fields; no model call |
| POST `/api/confirm` | ID, version | First answer; confirms and drops draft image only after successful commit |
| POST `/api/help` | ID, version, message, optional image | Follow-up; requires confirmation; maximum ten answers |
| POST `/api/feedback` | ID, version, outcome, note | Saves latest pending step as failed or unclear |
| POST `/api/solve` | ID, version | Explicit success; marks latest outcome worked |
| POST `/api/reset` | ID | Idempotent delete |
| GET `/api/health` | None | Installation readiness and limits; not an inference test |

Here “ID” means `session_id`. A successful mutation increments version; reset
removes the object. Analysis does not count as an answer turn. User text is limited
to 1,200 characters; image to 5 MB and 16 million pixels; body to 8 MB.

Understanding has exactly `problem` (500 chars), `evidence` (500), `uncertainty`
(300), all nonempty. A correction must replace the complete object before the
first answer. Mid-conversation observations use `/api/help`; approved fields are
not reopened in this release.

Answer has exactly `kind` (step/question/escalate), `title` (100 chars),
`instruction` (500), `explanation` (300), `check` (200), all nonempty. An attempt
has `question`, `answer`, `outcome` (pending/failed/unclear/worked), and `note`.
Failed feedback requires a nonempty note up to 500 characters; unclear may omit
its note. Repeated feedback on an already marked step is rejected.

Example feedback:

```json
{"session_id":"<32-character URL-safe ID>","version":3,
 "outcome":"failed","note":"There was no speaker icon"}
```

The UI commits this first, adopts the new version, then requests another answer.
A timeout cannot erase the report. Exact normalized repeats of failed instructions
are rejected; paraphrases are not reliably detected. Summaries return full attempt
records; prompts use shorter failed-action/result summaries to bound context.

Errors contain `error` and `code`. Common status codes: 400 invalid input, 403
origin/host, 404 missing/expired, 409 stale version/state/turn limit, 413 size,
429 busy/capacity, 502 bad model output/repeated action, 503 unavailable model,
504 timeout. Common codes map to localized UI messages.

No client-supplied history is accepted. Retrying after an ambiguous network failure
may yield a version conflict if the earlier request committed. The current UI
recovers by starting a new problem rather than reconstructing history.

## Saved history

POST `/api/history/list`: `query` up to 200 characters, optional positive integer
`before` cursor; returns `items` (up to 50) and `next_before`. Search is literal.
POST `/api/history/read`: `session_id`; returns a read-only text snapshot and UTC
update time. POST `/api/history/delete`: `session_id`; deletes its archive. If live,
it disables further saving and returns `active_session` with a new version.
All use the same local Host/Origin restrictions. No screenshots are returned or saved.
Reset/expiry remove live state only. `history_storage_error` signals a disk/database
problem; failed database commits leave the RAM snapshot unchanged.
