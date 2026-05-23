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
import {
  expectValidTokenResponse,
} from "../../src/api/assertions/auth.assertions.js";
import {
  expectCreateBookingResponse,
  expectValidBookingPayload,
} from "../../src/api/assertions/booking.assertions.js";
import { loadJsonFile } from "../../src/api/utils/json-loader.js";

const testData = loadJsonFile<BookingTestData>(
  "tests/api/data/booking-data.json",
);

test.describe("Booking E2E API Flow", () => {
  test("creates, retrieves, updates, partially updates and deletes a booking", async ({
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

    const createResponse = await restfulBookerClient.createBooking(
      testData.bookings.create,
    );
    await expectStatus(
      createResponse,
      200,
      "CreateBooking should return 200 for a valid booking payload",
    );

    const createBody = await expectJsonResponse<CreateBookingResponse>(
      createResponse,
      "CreateBooking response body should include bookingid and booking details",
    );

    expectCreateBookingResponse(createBody, testData.bookings.create);

    const bookingId = createBody.bookingid;
    const token = tokenBody.token;
    if (!token) {
      throw new Error("Auth token was not returned");
    }
    const getResponse = await restfulBookerClient.getBooking(bookingId);
    await expectStatus(
      getResponse,
      200,
      "GetBooking should return 200 for the newly created booking",
    );

    const getBody = await expectJsonResponse<BookingPayload>(
      getResponse,
      "GetBooking response body should contain booking details",
    );

    expectValidBookingPayload(getBody, testData.bookings.create);

    const updateResponse = await restfulBookerClient.updateBooking(
      bookingId,
      testData.bookings.update,
      token,
    );
    await expectStatus(
      updateResponse,
      200,
      "UpdateBooking should return 200 when a valid token and payload are provided",
    );

    const updateBody = await expectJsonResponse<BookingPayload>(
      updateResponse,
      "UpdateBooking response body should contain the updated booking",
    );

    expectValidBookingPayload(updateBody, testData.bookings.update);

    const patchResponse = await restfulBookerClient.partialUpdateBooking(
      bookingId,
      testData.bookings.partialUpdate,
      token,
    );
    await expectStatus(
      patchResponse,
      200,
      "PartialUpdateBooking should return 200 when valid patch fields are provided",
    );

    const patchBody = await expectJsonResponse<BookingPayload>(
      patchResponse,
      "PartialUpdateBooking response body should contain the patched booking",
    );

    const expectedPatchedBooking: BookingPayload = {
      ...testData.bookings.update,
      firstname:
        testData.bookings.partialUpdate.firstname ??
        testData.bookings.update.firstname,
      lastname:
        testData.bookings.partialUpdate.lastname ??
        testData.bookings.update.lastname,
      totalprice:
        testData.bookings.partialUpdate.totalprice ??
        testData.bookings.update.totalprice,
      depositpaid:
        testData.bookings.partialUpdate.depositpaid ??
        testData.bookings.update.depositpaid,
      bookingdates: {
        checkin:
          testData.bookings.partialUpdate.bookingdates?.checkin ??
          testData.bookings.update.bookingdates.checkin,
        checkout:
          testData.bookings.partialUpdate.bookingdates?.checkout ??
          testData.bookings.update.bookingdates.checkout,
      },
      additionalneeds:
        testData.bookings.partialUpdate.additionalneeds ??
        testData.bookings.update.additionalneeds,
    };

    expectValidBookingPayload(patchBody, expectedPatchedBooking);

    const getPatchedResponse = await restfulBookerClient.getBooking(bookingId);
    await expectStatus(
      getPatchedResponse,
      200,
      "GetBooking should return 200 after partial update",
    );

    const getPatchedBody = await expectJsonResponse<BookingPayload>(
      getPatchedResponse,
      "GetBooking response body should contain the patched booking details",
    );

    expectValidBookingPayload(getPatchedBody, expectedPatchedBooking);

    const deleteResponse = await restfulBookerClient.deleteBooking(
      bookingId,
      token,
    );
    await expectStatusIn(
      deleteResponse,
      [200, 201],
      "DeleteBooking should return a successful status for an existing booking",
    );

    const getDeletedResponse = await restfulBookerClient.getBooking(bookingId);
    await expectStatus(
      getDeletedResponse,
      404,
      "GetBooking should return 404 after the booking has been deleted",
    );
  });
});
