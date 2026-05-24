import { expect, test } from "@playwright/test";
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
import { expectCreateBookingResponse } from "../../src/api/assertions/booking.assertions.js";
import {
  formatBookingAsUrlEncoded,
  formatBookingAsXml,
  formatPartialBookingAsUrlEncoded,
  formatPartialBookingAsXml,
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
    depositpaid: true,
    bookingdates: {
      ...testData.bookings.create.bookingdates,
    },
  };
}

function buildUpdatedBookingPayload(formatName: string): BookingPayload {
  const timestamp = Date.now();

  return {
    ...testData.bookings.update,
    firstname: `Updated${timestamp}`,
    lastname: formatName,
    depositpaid: true,
    bookingdates: {
      ...testData.bookings.update.bookingdates,
    },
  };
}

function buildPartialBookingPayload(formatName: string): PartialBookingPayload {
  const timestamp = Date.now();

  return {
    firstname: `Patched${timestamp}`,
    additionalneeds: `${formatName} partial update`,
  };
}

function expectBookingMatches(
  actualBooking: BookingPayload,
  expectedBooking: BookingPayload,
  messagePrefix: string,
): void {
  expect(actualBooking.firstname, `${messagePrefix} firstname`).toBe(
    expectedBooking.firstname,
  );
  expect(actualBooking.lastname, `${messagePrefix} lastname`).toBe(
    expectedBooking.lastname,
  );
  expect(actualBooking.totalprice, `${messagePrefix} totalprice`).toBe(
    expectedBooking.totalprice,
  );
  expect(actualBooking.depositpaid, `${messagePrefix} depositpaid`).toBe(
    expectedBooking.depositpaid,
  );
  expect(actualBooking.bookingdates, `${messagePrefix} bookingdates`).toEqual(
    expectedBooking.bookingdates,
  );
  expect(
    actualBooking.additionalneeds,
    `${messagePrefix} additionalneeds`,
  ).toBe(expectedBooking.additionalneeds);
}

function expectPartialBookingApplied(
  actualBooking: BookingPayload,
  expectedBooking: BookingPayload,
  patchPayload: PartialBookingPayload,
  messagePrefix: string,
): void {
  expect(actualBooking.firstname, `${messagePrefix} patched firstname`).toBe(
    patchPayload.firstname,
  );
  expect(
    actualBooking.additionalneeds,
    `${messagePrefix} patched additionalneeds`,
  ).toBe(patchPayload.additionalneeds);

  expect(actualBooking.lastname, `${messagePrefix} unchanged lastname`).toBe(
    expectedBooking.lastname,
  );
  expect(
    actualBooking.totalprice,
    `${messagePrefix} unchanged totalprice`,
  ).toBe(expectedBooking.totalprice);
  expect(
    actualBooking.depositpaid,
    `${messagePrefix} unchanged depositpaid`,
  ).toBe(expectedBooking.depositpaid);
  expect(
    actualBooking.bookingdates,
    `${messagePrefix} unchanged bookingdates`,
  ).toEqual(expectedBooking.bookingdates);
}

test.describe("Booking Request Format API", () => {
  test("creates, updates and partially updates bookings using supported non-JSON request formats", async ({
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

    // Public sandbox note:
    // XML and URL-encoded payloads send boolean values as text.
    // To keep this request-format compatibility test stable, the non-JSON
    // create/update payloads use depositpaid=true. Full boolean behaviour is
    // covered by the JSON booking lifecycle test.

    const xmlCreateBooking = buildBookingPayloadForFormat("XmlCreate");
    const xmlUpdateBooking = buildUpdatedBookingPayload("XmlUpdate");
    const xmlPatchBooking = buildPartialBookingPayload("XML");

    const formCreateBooking = buildBookingPayloadForFormat("FormCreate");
    const formUpdateBooking = buildUpdatedBookingPayload("FormUpdate");
    const formPatchBooking = buildPartialBookingPayload("Form");

    const requestFormatScenarios = [
      {
        name: "XML",
        contentType: "text/xml",
        createBooking: xmlCreateBooking,
        createPayload: formatBookingAsXml(xmlCreateBooking),
        updateBooking: xmlUpdateBooking,
        updatePayload: formatBookingAsXml(xmlUpdateBooking),
        patchBooking: xmlPatchBooking,
        patchPayload: formatPartialBookingAsXml(xmlPatchBooking),
      },
      {
        name: "URL-encoded form",
        contentType: "application/x-www-form-urlencoded",
        createBooking: formCreateBooking,
        createPayload: formatBookingAsUrlEncoded(formCreateBooking),
        updateBooking: formUpdateBooking,
        updatePayload: formatBookingAsUrlEncoded(formUpdateBooking),
        patchBooking: formPatchBooking,
        patchPayload: formatPartialBookingAsUrlEncoded(formPatchBooking),
      },
    ];

    try {
      for (const scenario of requestFormatScenarios) {
        const createResponse =
          await restfulBookerClient.createBookingWithRawPayload(
            scenario.createPayload,
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

        expectCreateBookingResponse(createBody, scenario.createBooking);

        const updateResponse =
          await restfulBookerClient.updateBookingWithRawPayload(
            createBody.bookingid,
            scenario.updatePayload,
            scenario.contentType,
            token,
          );

        await expectStatus(
          updateResponse,
          200,
          `UpdateBooking should return 200 for ${scenario.name} request payload`,
        );

        const updateBody = await expectJsonResponse<BookingPayload>(
          updateResponse,
          `UpdateBooking response body should be valid JSON for ${scenario.name} request payload`,
        );

        expectBookingMatches(
          updateBody,
          scenario.updateBooking,
          `${scenario.name} UpdateBooking response should match submitted payload`,
        );

        const patchResponse =
          await restfulBookerClient.partialUpdateBookingWithRawPayload(
            createBody.bookingid,
            scenario.patchPayload,
            scenario.contentType,
            token,
          );

        await expectStatus(
          patchResponse,
          200,
          `PartialUpdateBooking should return 200 for ${scenario.name} request payload`,
        );

        const patchBody = await expectJsonResponse<BookingPayload>(
          patchResponse,
          `PartialUpdateBooking response body should be valid JSON for ${scenario.name} request payload`,
        );

        expectPartialBookingApplied(
          patchBody,
          scenario.updateBooking,
          scenario.patchBooking,
          `${scenario.name} PartialUpdateBooking response should contain patched values`,
        );
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
