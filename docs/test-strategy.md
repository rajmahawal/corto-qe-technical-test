# Test Strategy

This document explains the testing strategy used for the CORTO QE technical assessment.

The assessment contains two separate automation targets:

- DemoQA Book Store for Web UI automation
- Restful Booker for REST API automation

Because these are different systems, the API tests are not used as a lower-layer substitute for the DemoQA UI tests. Instead, each task is tested at the most appropriate layer for the functionality being assessed.

## Strategy Overview

The framework demonstrates two complementary automation approaches:

- API automation for endpoint and contract coverage
- UI automation for browser-based user journey coverage

This gives a good balance between:

- Coverage
- Speed
- Maintainability
- Reliability
- Debuggability
- CI/CD suitability

## API Automation Strategy

The Restful Booker API suite focuses on broad endpoint coverage because API tests are fast, stable and well suited for validating request and response behaviour.

The API suite covers:

- CreateToken
- GetBookingIds
- GetBooking
- CreateBooking
- UpdateBooking
- PartialUpdateBooking
- DeleteBooking
- HealthCheck

The API tests include:

- Positive scenarios
- Negative scenarios
- Data-driven tests
- Data flow between endpoints
- Search filter and no-match validation
- Response contract validation
- XML and URL-encoded request format validation for CreateBooking
- Clear assertion messages
- Cleanup where test data is created

## API Data Flow

The API tests demonstrate passing values between endpoints.

Example flow:

```text
CreateToken
CreateBooking
GetBooking
UpdateBooking
PartialUpdateBooking
DeleteBooking
Verify deleted booking is no longer available
```

This validates the API as a connected workflow not just isolated endpoint calls.

## API Positive Scenarios

Positive API scenarios validate expected successful behaviour, such as:

- Valid credentials return an auth token
- Booking IDs can be retrieved
- A booking can be created
- A booking can be retrieved by ID
- A booking can be fully updated
- A booking can be partially updated
- A booking can be deleted
- Health check returns a successful response

## API Negative Scenarios

Negative API scenarios validate failure behaviour, such as:

- Invalid credentials return the expected error response
- A missing booking returns the expected not-found response
- Protected booking operations fail without authentication
- Deleted bookings are no longer retrievable

These tests help confirm the API handles invalid or unauthorised requests correctly.

### Non-JSON Request Format Behaviour

The request format tests include XML and URL-encoded booking payloads.

During testing, the public Restful Booker sandbox showed a possible behaviour where `depositpaid=false` sent through XML or URL-encoded payloads may be returned as `depositpaid=true`.

The test documents this behaviour and validates the stable fields. Full boolean behaviour is still covered in the JSON booking lifecycle flow.

## UI Automation Strategy

The DemoQA Book Store UI suite focuses on critical user journeys through the browser.

The UI suite intentionally avoids trying to automate every possible UI interaction. Instead, it validates the highest-value flows:

- Book Store catalog displays expected headers and default books
- Search by exact title
- Search by partial title
- Search with no matching result
- Search result row validation
- Opening a book details page
- Validating book details
- Navigating back to the Book Store
- Verifying the store state after returning

## Critical UI E2E Flow

The main UI E2E journey is:

```text
Search for a book
Open the book details page
Verify title, author, publisher, ISBN, and website
Navigate back to the Book Store
Verify the store state
```

This flow was selected because it represents a real user journey through the Book Store website.

## Why UI Coverage Is Focused

UI E2E tests are valuable because they validate real browser behaviour and user experience.

However, they are also:

- Slower than API tests
- More expensive to maintain
- More sensitive to page layout changes
- More likely to be affected by public sandbox instability
- More difficult to debug than API tests

For this reason, the UI suite is intentionally focused on meaningful user journeys rather than exhaustive UI coverage.

## Important Assessment Context

The API and UI suites target different public applications in this assessment.

The API tests validate Restful Booker endpoint behaviour. The UI tests validate DemoQA Book Store browser behaviour.

Therefore, the API tests do not replace UI coverage for the DemoQA Book Store. The framework demonstrates that both API and UI automation can be designed, implemented, maintained and executed in one Playwright TypeScript project.

## Registration Scope

User registration is intentionally left out of scope.

The assessment allows registration to be excluded, and the higher-value Book Store flows are around:

- Discovering books
- Searching the catalog
- Viewing book details
- Returning to the catalog

## Test Data Strategy

Test data is stored separately from test logic.

API test data:

```text
tests/api/data/booking-data.json
```

UI test data:

```text
tests/ui/data/book-store-data.json
```

This keeps tests easier to read and makes future updates easier.

## Assertion Strategy

Assertions are designed to be:

- Specific
- Business-readable
- Useful when failures happen
- Clear in CI/CD logs

Examples:

```text
Book row for "Git Pocket Guide" should show author "Richard E. Silverman"
CreateToken response body should contain token details
DeleteBooking cleanup should return a successful status
```

The goal is that a failed test should quickly explain what behaviour failed.

## Flakiness Strategy

The framework avoids unnecessary flakiness by:

- Avoiding hardcoded sleeps
- Using Playwright auto-waiting
- Waiting for meaningful page states
- Keeping UI tests focused on stable, high-value user journeys
- Using API tests for broad endpoint and contract coverage
- Cleaning up created API test data
- Keeping tests independent

## Current Test Split

### API specs

```text
tests/api/authentication.api.spec.ts
tests/api/booking-e2e-flow.api.spec.ts
tests/api/booking-error-handling.api.spec.ts
tests/api/booking-partial-update.api.spec.ts
tests/api/booking-request-formats.api.spec.ts
tests/api/booking-search.api.spec.ts
tests/api/health-check.api.spec.ts
```

### UI specs

```text
tests/ui/book-store-catalog.ui.spec.ts
tests/ui/book-store-search.ui.spec.ts
tests/ui/book-details.ui.spec.ts
```

## Maintenance Strategy

When adding future tests:

1. Add API tests for endpoint behaviour, contracts, data flow and negative cases.
2. Add UI tests for meaningful browser-based user journeys.
3. Keep tests independent.
4. Keep test data externalized.
5. Use page objects for UI interactions.
6. Use API clients for API interactions.
7. Add clear assertion messages.
8. Avoid hardcoded waits.
9. Validate locally before pushing.

## Final Strategy Summary

This framework demonstrates both API and UI automation capability.

The API suite provides broad endpoint coverage for Restful Booker.

The UI suite provides focused browser journey coverage for DemoQA Book Store.

Together, they show a maintainable Playwright TypeScript automation approach that can be extended and executed in CI/CD.
