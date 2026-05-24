# Framework Design

This document explains the design decisions used in the Playwright TypeScript automation framework.

The framework was built step by step with a focus on maintainability, robustness, repeatability and CI/CD readiness.

For setup instructions, refer to [Setup Guide](setup.md).  
For test execution commands, refer to [Running Tests](running-tests.md).

## Design Goals

The main goals of this framework are:

- Keep tests readable and business focused
- Avoid duplicated request, selector and assertion logic
- Keep test data separate from test logic
- Use TypeScript types to catch mistakes early
- Provide clear failure messages
- Support both API and UI automation in one project
- Make the framework easy to extend with more tests later

## Why One Framework for API and UI?

Playwright supports both API and browser automation, so the same project can be used for both layers.

This gives several benefits:

- Same language: TypeScript
- Same runner: Playwright Test
- Same reporting: Playwright HTML report
- Same CI/CD setup
- Shared linting and type checking
- Easier maintenance for reviewers and future contributors

This keeps the assessment simple to run while still showing layered automation coverage.

## Project Layers

The project is separated into API and UI areas.

```text
src/
  api/
  ui/

tests/
  api/
  ui/
```

The `src/` folder contains reusable framework code.  
The `tests/` folder contains the actual test specifications.

## API Framework Design

API framework code is stored under:

```text
src/api/
  assertions/
  clients/
  types/
  utils/
```

API tests are stored under:

```text
tests/api/
  data/
```

### API Client Layer

The API client is responsible for making requests to the Restful Booker API.

```text
src/api/clients/restful-booker.client.ts
```

This keeps request details out of the test files.

For example, tests do not need to know the exact request headers or endpoint implementation details. They call business-focused methods such as:

```text
createToken
getBookingIds
getBooking
createBooking
updateBooking
partialUpdateBooking
deleteBooking
healthCheck
```

This makes the tests easier to read and easier to maintain.

### API Assertion Layer

API assertions are split by responsibility:

```text
src/api/assertions/response.assertions.ts
src/api/assertions/auth.assertions.ts
src/api/assertions/booking.assertions.ts
```

This separation keeps generic response checks away from domain-specific booking checks.

#### response.assertions.ts

Contains generic HTTP response helpers:

```text
expectStatus
expectStatusIn
expectJsonResponse
expectTextResponse
```

These helpers can be reused across any API test.

#### auth.assertions.ts

Contains CreateToken-specific assertions:

```text
expectValidTokenResponse
expectInvalidTokenResponse
```

These validate the authentication response contract.

#### booking.assertions.ts

Contains booking-specific assertions:

```text
expectValidBookingPayload
expectCreateBookingResponse
expectBookingIdArray
```

These validate the Restful Booker booking data contract.

### API Types

API types are stored in:

```text
src/api/types/booking.types.ts
```

These types define the expected request, response and test data shapes.

Examples:

```text
AuthTokenResponse
BookingPayload
PartialBookingPayload
CreateBookingResponse
BookingIdResponse
BookingTestData
```

Using TypeScript types helps catch mistakes during `npm run typecheck` before tests are executed.

### API Test Data

API test data is stored in:

```text
tests/api/data/booking-data.json
```

This keeps test data separate from test logic and makes it easier to update scenarios without changing the test code.

## UI Framework Design

UI framework code is stored under:

```text
src/ui/
  pages/
  types/
  utils/
```

UI tests are stored under:

```text
tests/ui/
  data/
```

### Page Object Model

The UI suite uses Page Object Model.

Page objects are stored in:

```text
src/ui/pages/book-store.page.ts
src/ui/pages/book-details.page.ts
```

The purpose of page objects is to keep selectors and UI actions out of the test files.

Instead of tests directly using selectors, they call readable business methods such as:

```text
goto
search
openBook
expectBookVisible
expectBookRowDetails
expectBookDetails
backToBookStore
```

This makes tests easier to understand and reduces duplication.

### UI Locator Strategy

The UI tests prefer Playwright-recommended locators where possible.

Preferred order:

1. Role locators
2. Accessible name locators
3. Text locators
4. Scoped CSS selectors only when required

Examples:

```text
getByRole("textbox", { name: "Type to search" })
getByRole("link", { name: bookTitle, exact: true })
getByRole("button", { name: "Back To Book Store" })
```

Some DemoQA book detail fields reuse the same child ID, so wrapper IDs are used to locate the correct field value.

Example:

```text
#title-wrapper #userName-value
#author-wrapper #userName-value
#publisher-wrapper #userName-value
```

This is intentional because the wrapper ID identifies which field value is being checked.

### UI Test Data

UI test data is stored in:

```text
tests/ui/data/book-store-data.json
```

This includes book titles, authors, publishers, and search terms used by the UI tests.

### UI Types

UI test data types are stored in:

```text
src/ui/types/book-store.types.ts
```

This gives compile-time safety when reading data from the JSON file.

## JSON Loader

The project uses small JSON loader utilities to load test data.

```text
src/api/utils/json-loader.ts
src/ui/utils/json-loader.ts
```

This keeps data loading consistent and avoids hardcoding test data inside spec files.

## Assertion Strategy

Assertions are written with clear descriptions so failures are easier to understand.

Example:

```text
Book row for "Git Pocket Guide" should show author "Richard E. Silverman"
```

This is useful during local debugging and CI review because the failure message explains the expected behaviour.

## Test Independence

Tests are designed to be independent.

API tests create and clean up their own booking data where needed.  
UI tests navigate to the required page and set their own search state.

This helps tests run reliably in different orders and in CI/CD.

## Parallel Execution

The framework supports parallel execution through Playwright.

API tests are fast and suitable for parallel execution.  
UI tests are focused on a small number of critical journeys to keep execution time reasonable.

## CI/CD Readiness

The framework is suitable for CI/CD because it provides:

- Clear npm scripts
- Lint command
- Type check command
- Separate API and UI test commands
- Full suite command
- HTML report
- Screenshots, videos, and traces on failure

Recommended validation before merging code:

```bash
npm run lint
npm run typecheck
npm run test:api
npm run test:ui
```

For final validation:

```bash
npm test
```

## Why This Design Scales

The framework can be extended by adding:

- More API client methods
- More API assertion helpers
- More page objects
- More UI test data
- More focused spec files
- CI workflows for API and UI execution

The structure keeps each responsibility in the right place, which makes the framework easier to maintain as test coverage grows.
