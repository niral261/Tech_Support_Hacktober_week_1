# Family Tech Support: a patient local helper for [person]

Draft only. Replace every bracket with real evidence before publishing. Confirm
the challenge's submission template and tags at the time of submission.

## Who I built this for

[Describe one real family member, the recurring tech problem, and why it matters.
Use a pseudonym if needed.]

## What I built

Family Tech Support accepts a plain-language question and optional screenshot.
It uses local Gemma 3 4B through Ollama to suggest one small action, ask a question,
or recommend trusted human help. The interface supports English, Hindi and Gujarati; the user edits the assistant’s
understanding before accepting an action. Screenshot crop, zoom and opaque redaction
happen locally. Explicit failed-step notes survive retry failures, and the user
can ask for an explanation or confirm success.

## Demo

[Link to your real video and public repository. Show a real local model response,
including a follow-up. Use a synthetic screenshot or one approved for publication.]

## Why open innovation matters

Gemma's downloadable weights let this app run on the recipient's own computer.
Ollama supplies the local inference runtime. After installation, no cloud API key
is needed for troubleshooting. The app does not write screenshots to disk. With the save option enabled, text
history is stored in local SQLite until deleted. Its source is available for inspection.

Gemma is open-weight under its own terms; the app is MIT licensed. These are
different licensing choices, and we do not redistribute model weights.

## How I built it

[Explain implementation choices, genuine problems encountered, and how you checked
the results. Credit AI coding help and non-trivial borrowed work.]

## What happened when they tried it

[Actual feedback and outcome. If untested, state that honestly.]

## Limitations and next steps

Image text can be misread. Four GB of GPU memory is tight, so we need to measure
real speed on the target computer. Instructions are suggestions checked by the
user; there is no automatic control of their device. The app runs on the Windows
PC and phone screenshots must be transferred there. Prompt rules cannot guarantee
safe advice.

## Prize categories

- Best Use of Gemma — local Gemma 3 4B is the core of troubleshooting.

[List another partner category only after genuinely using its technology.]
