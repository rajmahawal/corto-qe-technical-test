import { test, expect } from "@playwright/test";
import { RestfulBookerClient } from "../../src/api/clients/restful-booker.client.js";
import type {
  AuthTokenResponse,
  BookingTestData,
  CreateBookingResponse,
} from "../../src/api/types/booking.types.js";
import {
  expectJsonResponse,
  expectStatus,
  expectStatusIn,
  expectTextResponse,
} from "../../src/api/assertions/response.assertions.js";
import { expectValidTokenResponse } from "../../src/api/assertions/auth.assertions.js";
import { expectCreateBookingResponse } from "../../src/api/assertions/booking.assertions.js";
import { loadJsonFile } from "../../src/api/utils/json-loader.js";

const testData = loadJsonFile<BookingTestData>(
  "tests/api/data/booking-data.json",
);

test.describe("Booking API Error Handling", () => {
  test("returns 404 and expected error body when retrieving a booking that does not exist", async ({
    request,
  }) => {
    const restfulBookerClient = new RestfulBookerClient(request);

    const response = await restfulBookerClient.getBooking(
      testData.invalidBookingId,
    );

    await expectStatus(
      response,
      404,
      "GetBooking should return 404 for a booking ID that does not exist",
    );

    await expectTextResponse(
      response,
      "Not Found",
      "GetBooking should return the expected error body for a missing booking",
    );
  });

  test("does not allow full booking update without authentication", async ({
    request,
  }) => {
    const restfulBookerClient = new RestfulBookerClient(request);

    const createResponse = await restfulBookerClient.createBooking(
      testData.bookings.create,
    );
    await expectStatus(
      createResponse,
      200,
      "CreateBooking should return 200 during unauthorised update setup",
    );

    const createBody = await expectJsonResponse<CreateBookingResponse>(
      createResponse,
      "CreateBooking response body should contain booking details",
    );
    expectCreateBookingResponse(createBody, testData.bookings.create);

    const tokenResponse = await restfulBookerClient.createToken(
      testData.auth.valid,
    );
    await expectStatus(
      tokenResponse,
      200,
      "CreateToken should return 200 for cleanup",
    );

    const tokenBody = await expectJsonResponse<AuthTokenResponse>(
      tokenResponse,
      "CreateToken response body should contain token details",
    );
    expectValidTokenResponse(tokenBody);

    const token = tokenBody.token;
    if (!token) {
      throw new Error("Auth token was not returned");
    }
    try {
      const updateWithoutAuthResponse =
        await restfulBookerClient.updateBookingWithoutAuth(
          createBody.bookingid,
          testData.bookings.update,
        );

      await expectStatus(
        updateWithoutAuthResponse,
        403,
        "UpdateBooking should return 403 when auth token is missing",
      );

      await expectTextResponse(
        updateWithoutAuthResponse,
        "Forbidden",
        "UpdateBooking should return the expected error body when auth token is missing",
      );
    } finally {
      const deleteResponse = await restfulBookerClient.deleteBooking(
        createBody.bookingid,
        token,
      );

      await expectStatusIn(
        deleteResponse,
        [200, 201],
        "DeleteBooking cleanup should return a successful status",
      );
    }
  });

  test("does not allow booking deletion without authentication", async ({
    request,
  }) => {
    const restfulBookerClient = new RestfulBookerClient(request);

    const createResponse = await restfulBookerClient.createBooking(
      testData.bookings.create,
    );
    await expectStatus(
      createResponse,
      200,
      "CreateBooking should return 200 during unauthorised delete setup",
    );

    const createBody = await expectJsonResponse<CreateBookingResponse>(
      createResponse,
      "CreateBooking response body should contain booking details",
    );
    expectCreateBookingResponse(createBody, testData.bookings.create);

    const tokenResponse = await restfulBookerClient.createToken(
      testData.auth.valid,
    );
    await expectStatus(
      tokenResponse,
      200,
      "CreateToken should return 200 for cleanup",
    );

    const tokenBody = await expectJsonResponse<AuthTokenResponse>(
      tokenResponse,
      "CreateToken response body should contain token details",
    );
    expectValidTokenResponse(tokenBody);

    const token = tokenBody.token;
    if (!token) {
      throw new Error("Auth token was not returned");
    }

    try {
      const deleteWithoutAuthResponse =
        await restfulBookerClient.deleteBookingWithoutAuth(
          createBody.bookingid,
        );

      await expectStatus(
        deleteWithoutAuthResponse,
        403,
        "DeleteBooking should return 403 when auth token is missing",
      );

      await expectTextResponse(
        deleteWithoutAuthResponse,
        "Forbidden",
        "DeleteBooking should return the expected error body when auth token is missing",
      );
    } finally {
      const deleteResponse = await restfulBookerClient.deleteBooking(
        createBody.bookingid,
        token,
      );

      await expectStatusIn(
        deleteResponse,
        [200, 201],
        "DeleteBooking cleanup should return a successful status",
      );
    }
  });

  test("does not allow partial booking update without authentication", async ({
    request,
  }) => {
    const restfulBookerClient = new RestfulBookerClient(request);

    const tokenResponse = await restfulBookerClient.createToken(
      testData.auth.valid,
    );
    await expectStatus(
      tokenResponse,
      200,
      "CreateToken should return 200 before secured booking operations",
    );

    const tokenBody = await expectJsonResponse<AuthTokenResponse>(
      tokenResponse,
      "CreateToken response body should contain token details",
    );
    expectValidTokenResponse(tokenBody);

    const token = tokenBody.token;
    if (!token) {
      throw new Error("Auth token was not returned");
    }

    const createResponse = await restfulBookerClient.createBooking(
      testData.bookings.create,
    );
    await expectStatus(
      createResponse,
      200,
      "CreateBooking should return 200 for unauthenticated partial update test setup",
    );

    const createBody = await expectJsonResponse<CreateBookingResponse>(
      createResponse,
      "CreateBooking response body should contain booking details",
    );
    expectCreateBookingResponse(createBody, testData.bookings.create);

    try {
      const response =
        await restfulBookerClient.partialUpdateBookingWithoutAuth(
          createBody.bookingid,
          testData.bookings.partialUpdate,
        );

      await expectStatus(
        response,
        403,
        "PartialUpdateBooking should return 403 when authentication is not provided",
      );

      const responseBody = await response.text();

      expect(
        responseBody,
        "PartialUpdateBooking without authentication should return Forbidden",
      ).toBe("Forbidden");
    } finally {
      const deleteResponse = await restfulBookerClient.deleteBooking(
        createBody.bookingid,
        token,
      );

      await expectStatusIn(
        deleteResponse,
        [200, 201],
        "DeleteBooking cleanup should return a successful status",
      );
    }
  });
});
