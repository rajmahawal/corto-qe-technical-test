import { expect, test } from "@playwright/test";
import { RestfulBookerClient } from "../../src/api/clients/restful-booker.client.js";
import type {
  AuthTokenResponse,
  BookingIdResponse,
  BookingSearchFilters,
  BookingTestData,
  CreateBookingResponse,
} from "../../src/api/types/booking.types.js";
import {
  expectJsonResponse,
  expectStatus,
  expectStatusIn,
} from "../../src/api/assertions/response.assertions.js";
import { expectValidTokenResponse } from "../../src/api/assertions/auth.assertions.js";
import {
  expectBookingIdArray,
  expectCreateBookingResponse,
} from "../../src/api/assertions/booking.assertions.js";
import { loadJsonFile } from "../../src/api/utils/json-loader.js";

const testData = loadJsonFile<BookingTestData>(
  "tests/api/data/booking-data.json",
);

test.describe("Booking Search API", () => {
  test("returns booking IDs with the expected response shape", async ({
    request,
  }) => {
    const restfulBookerClient = new RestfulBookerClient(request);

    const response = await restfulBookerClient.getBookingIds();
    await expectStatus(
      response,
      200,
      "GetBookingIds should return 200 for all booking IDs",
    );

    const bookingIds = await expectJsonResponse<BookingIdResponse[]>(
      response,
      "GetBookingIds response body should be a valid JSON array",
    );

    expectBookingIdArray(bookingIds);
  });

  test("returns valid booking IDs when filtering by supported query parameters", async ({
    request,
  }) => {
    const restfulBookerClient = new RestfulBookerClient(request);

    const tokenResponse = await restfulBookerClient.createToken(
      testData.auth.valid,
    );
    await expectStatus(
      tokenResponse,
      200,
      "CreateToken should return 200 for search test setup",
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
      "CreateBooking should return 200 for search test setup",
    );

    const createBody = await expectJsonResponse<CreateBookingResponse>(
      createResponse,
      "CreateBooking response body should contain booking details",
    );
    expectCreateBookingResponse(createBody, testData.bookings.create);

    const searchScenarios: Array<{
      name: string;
      filters: BookingSearchFilters;
      expectCreatedBookingId: boolean;
      expectEmptyResult?: boolean;
    }> = [
      {
        name: "firstname",
        filters: {
          firstname: testData.bookings.create.firstname,
        },
        expectCreatedBookingId: true,
      },
      {
        name: "lastname",
        filters: {
          lastname: testData.bookings.create.lastname,
        },
        expectCreatedBookingId: true,
      },
      {
        name: "firstname and lastname",
        filters: {
          firstname: testData.bookings.create.firstname,
          lastname: testData.bookings.create.lastname,
        },
        expectCreatedBookingId: true,
      },
      {
        name: "checkin date",
        filters: {
          checkin: testData.bookings.create.bookingdates.checkin,
        },
        expectCreatedBookingId: false,
      },
      {
        name: "checkout date",
        filters: {
          checkout: testData.bookings.create.bookingdates.checkout,
        },
        expectCreatedBookingId: false,
      },
      {
        name: "checkin and checkout dates",
        filters: {
          checkin: testData.bookings.create.bookingdates.checkin,
          checkout: testData.bookings.create.bookingdates.checkout,
        },
        expectCreatedBookingId: false,
      },
      {
        name: "no matching firstname",
        filters: {
          firstname: "NoMatchingFirstname12345",
        },
        expectCreatedBookingId: false,
        expectEmptyResult: true,
      },
    ];

    try {
      for (const scenario of searchScenarios) {
        const searchResponse = await restfulBookerClient.getBookingIds(
          scenario.filters,
        );

        await expectStatus(
          searchResponse,
          200,
          `GetBookingIds should return 200 when filtering by ${scenario.name}`,
        );

        const filteredBookingIds = await expectJsonResponse<
          BookingIdResponse[]
        >(
          searchResponse,
          `Filtered GetBookingIds response body should be valid JSON when filtering by ${scenario.name}`,
        );

        expectBookingIdArray(filteredBookingIds, { allowEmpty: true });

        if (scenario.expectEmptyResult) {
          expect(
            filteredBookingIds,
            `Filtered booking search by ${scenario.name} should return an empty array`,
          ).toHaveLength(0);
        }

        if (scenario.expectCreatedBookingId) {
          const returnedBookingIds = filteredBookingIds.map(
            (booking) => booking.bookingid,
          );

          expect(
            returnedBookingIds,
            `Filtered booking search by ${scenario.name} should include the booking created during setup`,
          ).toContain(createBody.bookingid);
        }
      }
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
