import { expect } from "@playwright/test";
import type { AuthTokenResponse } from "../types/booking.types.js";

export function expectValidTokenResponse(
  responseBody: AuthTokenResponse,
): void {
  expect(
    Object.keys(responseBody),
    "CreateToken success response should only contain token",
  ).toEqual(["token"]);

  expect(responseBody.token, "Auth token should be a string").toEqual(
    expect.any(String),
  );

  expect(
    responseBody.token?.length,
    "Auth token should not be empty",
  ).toBeGreaterThan(0);

  expect(
    responseBody.reason,
    "CreateToken success response should not contain an error reason",
  ).toBeUndefined();
}

export function expectInvalidTokenResponse(
  responseBody: AuthTokenResponse,
): void {
  expect(
    responseBody,
    "CreateToken error response should match expected error contract",
  ).toEqual({
    reason: "Bad credentials",
  });

  expect(
    responseBody.token,
    "CreateToken error response should not contain token",
  ).toBeUndefined();
}
