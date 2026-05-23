import { test } from "@playwright/test";
import { RestfulBookerClient } from "../../src/api/clients/restful-booker.client.js";
import type {
  AuthTokenResponse,
  BookingTestData,
} from "../../src/api/types/booking.types.js";
import {
  expectJsonResponse,
  expectStatus,
} from "../../src/api/assertions/response.assertions.js";
import {
  expectInvalidTokenResponse,
  expectValidTokenResponse,
} from "../../src/api/assertions/auth.assertions.js";
import { loadJsonFile } from "../../src/api/utils/json-loader.js";

const testData = loadJsonFile<BookingTestData>(
  "tests/api/data/booking-data.json",
);

test.describe("CreateToken API", () => {
  test("creates an auth token with valid credentials", async ({ request }) => {
    const restfulBookerClient = new RestfulBookerClient(request);

    const response = await restfulBookerClient.createToken(testData.auth.valid);
    await expectStatus(
      response,
      200,
      "CreateToken should return 200 for valid credentials",
    );

    const responseBody = await expectJsonResponse<AuthTokenResponse>(
      response,
      "CreateToken response body should be valid JSON",
    );
    expectValidTokenResponse(responseBody);
  });

  test("does not create an auth token with invalid credentials", async ({
    request,
  }) => {
    const restfulBookerClient = new RestfulBookerClient(request);

    const response = await restfulBookerClient.createToken(
      testData.auth.invalid,
    );
    await expectStatus(
      response,
      200,
      "CreateToken returns 200 with an error reason for invalid credentials",
    );

    const responseBody = await expectJsonResponse<AuthTokenResponse>(
      response,
      "Invalid CreateToken response body should be valid JSON",
    );

    expectInvalidTokenResponse(responseBody);
  });
});
