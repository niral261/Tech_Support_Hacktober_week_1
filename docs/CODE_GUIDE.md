# Read the code in this order

1. `app/models.py`: immutable values, Understanding/SupportAnswer field validation.
2. `app/repository.py`: snapshots, version checks, feedback, capacity and lazy expiry.
3. `app/service.py`: analyze → correct → confirm; follow-up, outcome, solve/reset.
4. `app/prompts.py`: selected language, approved facts, compact failed summaries.
5. `app/images.py` and `app/ollama.py`: image and model adapters.
6. `app/controller.py` and `app/server.py`: HTTP routes, origin/body/static boundaries.
7. `app/main.py`: composition root connecting the classes.
8. `app/static/translations.js`: interface catalogs and LanguageService.
9. `app/static/editor.js`: ScreenshotEditor and pixel coordinate mapping.
10. `app/static/app.js`: ApiClient, AnswerView and FamilySupportApp orchestration.
11. `tests/test_new_flow.py`: invariants and recovery cases.
12. `tools/build_technical_pdf.py`: all vector diagrams and learning explanations.

The project uses explicit constructor arguments and ordinary classes. Tests use
FakeModel so workflow checks do not depend on downloads or GPU availability. Old
follow-up unit tests seed a confirmed snapshot to isolate that use case; new-flow
and HTTP/browser tests exercise mandatory analysis and confirmation end to end.
