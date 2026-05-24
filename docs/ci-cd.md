# CI/CD Execution

This project includes GitHub Actions pipelines for API and UI test execution.

## Pipeline Files

The workflow files are stored here:

```text
.github/workflows/api-pipeline.yml
.github/workflows/ui-pipeline.yml
```

GitHub Actions requires workflow files to be inside `.github/workflows`.

## API Pipeline

The API pipeline runs:

```bash
npm ci
npx playwright install --with-deps
npm run lint
npm run typecheck
npm run test:api
```

It uses:

```text
API_BASE_URL=https://restful-booker.herokuapp.com
```

## UI Pipeline

The UI pipeline runs:

```bash
npm ci
npx playwright install --with-deps
npm run lint
npm run typecheck
npm run test:ui
```

It uses:

```text
UI_BASE_URL=https://demoqa.com
```

## Why Separate Pipelines?

API and UI tests are separated because they have different execution characteristics.

API tests are faster and better for broad functional coverage. UI tests are browser-based and focused on critical user journeys.

Keeping them separate gives clearer feedback when a pipeline fails.

## Artifacts

Both pipelines upload Playwright artifacts when available:

```text
playwright-report/
test-results/
```

These help debug failures using reports, screenshots, videos and traces.

## Local Equivalent

To run the same checks locally:

```bash
npm run lint
npm run typecheck
npm run test:api
npm run test:ui
```
