# Contributing

Use Python 3.11+ and install `requirements.txt`. Run the unittest suite before
proposing a change. Keep dependencies small and inference local. Use classes
where they own state or a clear responsibility; avoid abstractions without a use.

For bug reports, include Python/Ollama versions, the device type, the exact error,
and a synthetic reproduction. Do not attach private screenshots or credentials.

An improvement should make the interface clearer for an inexperienced person.
Never add an external request, telemetry, or persistent screenshot storage without
an explicit design decision and clear user consent in the product.

Document new behaviors in README.md and extend meaningful validation as needed.
