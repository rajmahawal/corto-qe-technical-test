# Running Tests

This guide explains the main commands used to run checks and tests.

For initial installation and Node.js setup, refer to [Setup Guide](setup.md).

## Main Commands

| Command             | Purpose                         |
| ------------------- | ------------------------------- |
| `npm run lint`      | Run ESLint checks               |
| `npm run typecheck` | Run TypeScript type checking    |
| `npm run test:api`  | Run API tests                   |
| `npm run test:ui`   | Run UI tests                    |
| `npm test`          | Run the full test suite         |
| `npm run report`    | Open the Playwright HTML report |

## Recommended Local Validation

Before committing code, run:

```bash
npm run lint
npm run typecheck
npm run test:api
npm run test:ui
```

Before final submission, run:

```bash
npm test
```

## Run API Tests

```bash
npm run test:api
```

## Run UI Tests

```bash
npm run test:ui
```

## Run All Tests

```bash
npm test
```

## Run One API Spec

```bash
npx playwright test tests/api/authentication.api.spec.ts --project=api
```

Example for the booking E2E API flow:

```bash
npx playwright test tests/api/booking-e2e-flow.api.spec.ts --project=api
```

## Run One UI Spec

```bash
npx playwright test tests/ui/book-store-search.ui.spec.ts --project=ui-chromium --workers=1
```

Example for the book details E2E journey:

```bash
npx playwright test tests/ui/book-details.ui.spec.ts --project=ui-chromium --workers=1
```

Using `--workers=1` for targeted UI runs can make browser execution easier to observe and debug.

## Run UI Tests in Headed Mode

```bash
npm run test:headed
```

Or run a specific UI spec in headed mode:

```bash
npx playwright test tests/ui/book-details.ui.spec.ts --project=ui-chromium --headed --workers=1
```

## Run Playwright UI Mode

```bash
npx playwright test --ui
```

For the UI project only:

```bash
npx playwright test --ui --project=ui-chromium
```

## Debug a Test

```bash
npx playwright test tests/ui/book-details.ui.spec.ts --project=ui-chromium --debug
```

## Open Test Report

```bash
npm run report
```

More reporting details are available in [Test Reporting](test-reporting.md).

## Public Sandbox Note

Both DemoQA and Restful Booker are public sandbox applications. If a test fails unexpectedly, rerun the targeted spec first to confirm whether the issue is a real regression, a timing issue or public sandbox instability.

## CI Equivalent

The GitHub Actions pipelines run the same core checks.

Pipeline files:

```text
.github/workflows/api-pipeline.yml
.github/workflows/ui-pipeline.yml
```

More CI details are available in [CI/CD Execution](ci-cd.md).
