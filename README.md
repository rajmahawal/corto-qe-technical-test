# CORTO QE Technical Test

This repository contains a Playwright TypeScript automation framework for the CORTO Quality Engineering technical assessment.

The framework covers:

- Web UI automation for the DemoQA Book Store
- REST API automation for the Restful Booker API
- AI-assisted endpoint automation notes for Task 2 (Part B)

## Why Playwright?

I chose Playwright for both UI and API automation so the assessment could be implemented in one consistent framework, using the same language and project structure.

Key reasons:

- One tool supports both UI and API automation.
- TypeScript provides type safety and better maintainability.
- Playwright is fast, reliable and well suited for CI/CD execution.
- It supports browser automation features such as multiple tabs, multiple browser engines, tracing, screenshots, videos, and HTML reports.
- It has strong debugging support through Playwright Inspector, Trace Viewer and UI Mode.
- It integrates easily with build pipelines.
- Playwright MCP and AI-assisted tooling can also help explore manual edge cases that may not be good candidates for automation.

Using one framework for both layers keeps the project easier to maintain, easier to scale, and easier for reviewers or future team members to execute.

## Quick Start

```bash
npm install
npx playwright install
npm run lint
npm run typecheck
npm test
```

## Documentation

Detailed documentation is available in the `docs/` folder:

- [Setup Guide](docs/setup.md) — local setup, Node version, dependency installation, Playwright browser installation and environment variables
- [Running Tests](docs/running-tests.md) — commands for lint, typecheck, API tests, UI tests, full suite, headed mode, UI mode and debug mode
- [Test Reporting](docs/test-reporting.md) — HTML report, traces, screenshots, videos, failure diagnostics and CI artifacts
- [Framework Design](docs/framework-design.md) — project architecture, API client layer, UI page objects, types, assertions and locator strategy
- [Test Strategy](docs/test-strategy.md) — API-first coverage, focused UI E2E coverage, test pyramid thinking and maintenance approach
- [AI Usage](docs/ai-usage.md) — how AI was used, how output was reviewed, and how AI-assisted changes were validated
- [CI/CD Execution](docs/ci-cd.md) — recommended GitHub Actions workflows, pipeline structure and artifact handling

## Project Structure

```text
src/
  api/
    assertions/
    clients/
    types/
    utils/

  config/

  ui/
    pages/
    types/
    utils/

tests/
  api/
    data/

  ui/
    data/
    fixtures/

ai-assisted-endpoint/
docs/
.github/
```

## Test Coverage Summary

### API Automation

The API suite covers the Restful Booker endpoints with positive, negative, data-driven and end-to-end flow coverage.

Current API coverage includes:

- CreateToken
- GetBookingIds, including supported filters and no-match search validation
- GetBooking
- CreateBooking
- UpdateBooking
- PartialUpdateBooking
- DeleteBooking
- XML and URL-encoded request format validation for CreateBooking, UpdateBooking and PartialUpdateBooking

### UI Automation

The UI suite covers critical DemoQA Book Store journeys:

- Book Store catalog displays expected headers and default books
- Search by exact title
- Search by partial title
- No-result search behaviour
- Search → open book → verify details → navigate back → verify store state

## AI-Assisted Endpoint Output

Task 2 (PartB) documentation is available here:

- [AI-Assisted CreateToken Endpoint](ai-assisted-endpoint/create-token.md)

This file includes:

- The prompt used
- The AI-generated output
- Issues found in the raw AI output
- Corrections and improvements made
- Final implementation reference

## Main Commands

```bash
npm run lint
npm run typecheck
npm run test:api
npm run test:ui
npm test
npm run report
```

For more details, refer to [Running Tests](docs/running-tests.md).

## CI Health Check

The API pipeline performs a lightweight `/ping` health check before running the API test suite.

This is handled in:

```text
.github/workflows/api-pipeline.yml
```

## Public Sandbox Notes

Both DemoQA and Restful Booker are public sandbox applications, so tests are designed to validate stable behaviours and avoid brittle assumptions. Any known quirks or trade-offs are documented in the relevant docs pages.

## Engineering Approach

The goal of this framework is not just to create tests, but to create a scalable automation foundation built around practical quality engineering rather than unnecessary test volume.

The API suite focuses on endpoint coverage, data flow, response contracts and negative scenarios. The UI suite focuses on the most valuable Book Store user journeys through the browser.

The project is structured so another engineer can clone the repo, install dependencies, run the tests locally or in CI and understand the design decisions through the linked documentation.

The framework was developed step by step, continuously executed and validated throughout implementation so it can be extended with more tests in the future.
```
