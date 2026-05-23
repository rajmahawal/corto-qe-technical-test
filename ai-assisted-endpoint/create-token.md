# AI-Assisted Endpoint Automation: CreateToken

## Endpoint

`POST /auth`

## Purpose

This endpoint creates an authentication token using valid Restful Booker credentials. The token is required for booking operations such as update, partial update, and delete.

## Prompt Used

Prompt:

Generate a Playwright TypeScript API test for the Restful Booker POST /auth endpoint. Refer the api docs here https://restful-booker.herokuapp.com/apidoc/index.html#api-Auth-CreateToken and review the existing framework to follow the current structure.

The test should:

- Send valid credentials to create an auth token
- Assert the response status is 200
- Assert the response body contains a token
- Also include a negative test for invalid credentials
- Use the best coding practice to make it maintainable, robust and repeatable

## AI-Generated Output

```typescript
import { test, expect } from "@playwright/test";

test.describe("Auth API", () => {
  test("creates a token with valid credentials", async ({ request }) => {
    const response = await request.post("/auth", {
      data: {
        username: "admin",
        password: "password123",
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.token).toBeTruthy();
  });

  test("returns an error for invalid credentials", async ({ request }) => {
    const response = await request.post("/auth", {
      data: {
        username: "invalid",
        password: "invalid",
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.reason).toBe("Bad credentials");
  });
});
```

## Issues in the AI Output

- It used direct Playwright request calls inside the test instead of using the shared `RestfulBookerClient`.
- It hard-coded credentials directly in the test instead of using the shared JSON test data file.
- It only checked that the token was truthy, which is a weak assertion.
- It did not validate the full success response contract.
- It did not validate that the invalid credentials response does not include a token.
- It had limited assertion messages, which would make failures harder to understand.
- It did not use reusable assertion helpers.
- It did not follow the same structure as the rest of the API suite.

## Corrections and Improvements Made

The AI-generated output was useful as a starting point but it required several improvements before adding it to the project:

- Used `RestfulBookerClient` from `src/api/clients` to keep the test focused on behaviour instead of request implementation details.
- Used typed models from `src/api/types`, including `AuthTokenResponse` and `BookingTestData`.
- Used JSON-driven test data from `tests/api/data/booking-data.json`.
- Used reusable response assertion helpers from `src/api/assertions/response.assertions.ts`.
- Used reusable authentication assertion helpers from `src/api/assertions/auth.assertions.ts`.
- Replaced the weak `toBeTruthy()` token check with `expectValidTokenResponse`.
- Added full response contract validation for the success case: `{ token: string }`.
- Added full response contract validation for the error case: `{ reason: "Bad credentials" }`
- Confirmed the invalid credentials response does not include a token.
- Added clearer assertion messages for easier debugging.
- Validated the final implementation with linting, type checking, and API test execution.

## Final Implementation

The final implementation is in:
`tests/api/authentication.api.spec.ts`

Supporting files:

- `src/api/clients/restful-booker.client.ts`
- `src/api/types/booking.types.ts`
- `src/api/assertions/auth.assertions.ts`
- `src/api/assertions/response.assertions.ts`
- `tests/api/data/booking-data.json`

## Final Test Coverage

The final implementation covers:

- Valid credentials return a token.
- Token response has the expected shape: `{ token: string }`.
- Token is a non-empty string.
- Invalid credentials return `{ reason: "Bad credentials" }`.
- Invalid credentials response does not include a token.

### API Behavior Note

⚠️ **Status code quirk** — The Restful Booker API returns HTTP 200 for invalid credentials (with `{ reason: "Bad credentials" }` body) rather than the more conventional HTTP 401.
