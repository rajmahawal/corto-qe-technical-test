import { test } from "@playwright/test";
import { RestfulBookerClient } from "../../src/api/clients/restful-booker.client.js";
import type {
  AuthTokenResponse,
  BookingPayload,
  BookingTestData,
  CreateBookingResponse,
  PartialBookingPayload,
} from "../../src/api/types/booking.types.js";
import {
  expectJsonResponse,
  expectStatus,
  expectStatusIn,
} from "../../src/api/assertions/response.assertions.js";
import { expectValidTokenResponse } from "../../src/api/assertions/auth.assertions.js";
import {
  expectCreateBookingResponse,
  expectValidBookingPayload,
} from "../../src/api/assertions/booking.assertions.js";
import { loadJsonFile } from "../../src/api/utils/json-loader.js";

const testData = loadJsonFile<BookingTestData>(
  "tests/api/data/booking-data.json",
);

// NOTE: merging locally rather than re-fetching to keep the test self-contained
// and avoid masking bugs where GET returns stale data
function mergeBookingPayload(
  currentBooking: BookingPayload,
  partialUpdate: PartialBookingPayload,
): BookingPayload {
  return {
    firstname: partialUpdate.firstname ?? currentBooking.firstname,
    lastname: partialUpdate.lastname ?? currentBooking.lastname,
    totalprice: partialUpdate.totalprice ?? currentBooking.totalprice,
    depositpaid: partialUpdate.depositpaid ?? currentBooking.depositpaid,
    bookingdates: {
      checkin:
        partialUpdate.bookingdates?.checkin ??
        currentBooking.bookingdates.checkin,
      checkout:
        partialUpdate.bookingdates?.checkout ??
        currentBooking.bookingdates.checkout,
    },
    additionalneeds:
      partialUpdate.additionalneeds ?? currentBooking.additionalneeds,
  };
}

test.describe("Booking PartialUpdate API", () => {
  test("updates each supported optional booking field independently", async ({
    request,
  }) => {
    const restfulBookerClient = new RestfulBookerClient(request);

    const tokenResponse = await restfulBookerClient.createToken(
      testData.auth.valid,
    );
    await expectStatus(
      tokenResponse,
      200,
      "CreateToken should return 200 before partial update operations",
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
      "CreateBooking should return 200 before partial update scenarios",
    );

    const createBody = await expectJsonResponse<CreateBookingResponse>(
      createResponse,
      "CreateBooking response body should contain booking details",
    );
    expectCreateBookingResponse(createBody, testData.bookings.create);

    let expectedBooking: BookingPayload = testData.bookings.create;

    const patchScenarios: Array<{
      name: string;
      payload: PartialBookingPayload;
    }> = [
      {
        name: "firstname",
        payload: {
          firstname: "PartialFirstName",
        },
      },
      {
        name: "lastname",
        payload: {
          lastname: "PartialLastName",
        },
      },
      {
        name: "totalprice",
        payload: {
          totalprice: 999,
        },
      },
      {
        name: "depositpaid",
        payload: {
          depositpaid: false,
        },
      },
      {
        name: "booking dates",
        payload: {
          bookingdates: {
            checkin: "2026-09-01",
            checkout: "2026-09-10",
          },
        },
      },
      {
        name: "additionalneeds",
        payload: {
          additionalneeds: "Dinner",
        },
      },
    ];

    try {
      for (const scenario of patchScenarios) {
        const patchResponse = await restfulBookerClient.partialUpdateBooking(
          createBody.bookingid,
          scenario.payload,
          token,
        );

        await expectStatus(
          patchResponse,
          200,
          `PartialUpdateBooking should return 200 when updating ${scenario.name}`,
        );

        expectedBooking = mergeBookingPayload(
          expectedBooking,
          scenario.payload,
        );

        const patchBody = await expectJsonResponse<BookingPayload>(
          patchResponse,
          `PartialUpdateBooking response body should contain the updated booking when updating ${scenario.name}`,
        );

        expectValidBookingPayload(patchBody, expectedBooking);

        const getUpdatedResponse = await restfulBookerClient.getBooking(
          createBody.bookingid,
        );
        await expectStatus(
          getUpdatedResponse,
          200,
          `GetBooking should return 200 after updating ${scenario.name}`,
        );

        const getUpdatedBody = await expectJsonResponse<BookingPayload>(
          getUpdatedResponse,
          `GetBooking response body should contain persisted changes after updating ${scenario.name}`,
        );

        expectValidBookingPayload(getUpdatedBody, expectedBooking);
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
