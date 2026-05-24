import { test } from "@playwright/test";
import { RestfulBookerClient } from "../../src/api/clients/restful-booker.client.js";
import type {
  AuthTokenResponse,
  BookingPayload,
  BookingTestData,
  CreateBookingResponse,
} from "../../src/api/types/booking.types.js";
import {
  expectJsonResponse,
  expectStatus,
  expectStatusIn,
} from "../../src/api/assertions/response.assertions.js";
import { expectValidTokenResponse } from "../../src/api/assertions/auth.assertions.js";
import { expectCreateBookingResponse } from "../../src/api/assertions/booking.assertions.js";
import {
  formatBookingAsUrlEncoded,
  formatBookingAsXml,
} from "../../src/api/utils/booking-payload-formatters.js";
import { loadJsonFile } from "../../src/api/utils/json-loader.js";

const testData = loadJsonFile<BookingTestData>(
  "tests/api/data/booking-data.json",
);

function buildBookingPayloadForFormat(formatName: string): BookingPayload {
  const timestamp = Date.now();

  return {
    ...testData.bookings.create,
    firstname: `Format${timestamp}`,
    lastname: formatName,
    bookingdates: {
      ...testData.bookings.create.bookingdates,
    },
  };
}

test.describe("Booking Request Format API", () => {
  test("creates bookings using supported non-JSON request formats", async ({
    request,
  }) => {
    const restfulBookerClient = new RestfulBookerClient(request);
    const createdBookingIds: number[] = [];

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

    const xmlBooking = buildBookingPayloadForFormat("XmlPayload");
    const formBooking = buildBookingPayloadForFormat("FormPayload");

    const requestFormatScenarios = [
      {
        name: "XML",
        contentType: "text/xml",
        booking: xmlBooking,
        payload: formatBookingAsXml(xmlBooking),
      },
      {
        name: "URL-encoded form",
        contentType: "application/x-www-form-urlencoded",
        booking: formBooking,
        payload: formatBookingAsUrlEncoded(formBooking),
      },
    ];

    try {
      for (const scenario of requestFormatScenarios) {
        const createResponse =
          await restfulBookerClient.createBookingWithRawPayload(
            scenario.payload,
            scenario.contentType,
          );

        await expectStatus(
          createResponse,
          200,
          `CreateBooking should return 200 for ${scenario.name} request payload`,
        );

        const createBody = await expectJsonResponse<CreateBookingResponse>(
          createResponse,
          `CreateBooking response body should be valid JSON for ${scenario.name} request payload`,
        );

        createdBookingIds.push(createBody.bookingid);

        expectCreateBookingResponse(createBody, scenario.booking);
      }
    } finally {
      for (const bookingId of createdBookingIds) {
        const deleteResponse = await restfulBookerClient.deleteBooking(
          bookingId,
          token,
        );

        await expectStatusIn(
          deleteResponse,
          [200, 201],
          `DeleteBooking cleanup should return a successful status for booking ${bookingId}`,
        );
      }
    }
  });
});
