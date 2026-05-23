import { expect } from "@playwright/test";
import type {
  BookingIdResponse,
  BookingPayload,
  CreateBookingResponse,
} from "../types/booking.types.js";

export function expectValidBookingPayload(
  booking: BookingPayload,
  expectedBooking?: BookingPayload,
): void {
  const dateFormat = /^\d{4}-\d{2}-\d{2}$/;

  expect(booking.firstname, "Booking firstname should be a string").toEqual(
    expect.any(String),
  );

  expect(booking.lastname, "Booking lastname should be a string").toEqual(
    expect.any(String),
  );

  expect(booking.totalprice, "Booking totalprice should be a number").toEqual(
    expect.any(Number),
  );

  expect(
    booking.depositpaid,
    "Booking depositpaid should be a boolean",
  ).toEqual(expect.any(Boolean));

  expect(
    booking.bookingdates,
    "Booking should contain bookingdates object",
  ).not.toBeNull();

  expect(
    booking.bookingdates,
    "Booking should contain bookingdates object",
  ).not.toBeUndefined();

  expect(
    booking.bookingdates,
    "Booking should contain bookingdates object",
  ).toEqual(expect.any(Object));

  expect(
    booking.bookingdates.checkin,
    "Booking checkin date should be a string",
  ).toEqual(expect.any(String));

  expect(
    booking.bookingdates.checkout,
    "Booking checkout date should be a string",
  ).toEqual(expect.any(String));

  // NOTE: regex validates format only, not calendar validity (e.g. 2024-13-99 would pass)
  // good enough for API contract testing purposes
  expect(
    booking.bookingdates.checkin,
    "checkin date should use YYYY-MM-DD format",
  ).toMatch(dateFormat);

  expect(
    booking.bookingdates.checkout,
    "Booking checkout date should use CCYY-MM-DD format",
  ).toMatch(dateFormat);

  expect(
    booking.additionalneeds,
    "Booking additionalneeds should be a string",
  ).toEqual(expect.any(String));

  if (expectedBooking) {
    expect(booking, "Booking payload should match expected booking").toEqual(
      expectedBooking,
    );
  }
}

export function expectCreateBookingResponse(
  responseBody: CreateBookingResponse,
  expectedBooking: BookingPayload,
): void {
  expect(
    responseBody.bookingid,
    "CreateBooking response should contain numeric bookingid",
  ).toEqual(expect.any(Number));

  expectValidBookingPayload(responseBody.booking, expectedBooking);
}

export function expectBookingIdArray(
  bookingIds: BookingIdResponse[],
  options?: { allowEmpty?: boolean },
): void {
  expect(
    Array.isArray(bookingIds),
    "response should be an array of booking Ids",
  ).toBe(true);

  if (!options?.allowEmpty) {
    expect(
      bookingIds.length,
      "GetBookingIds should return at least one booking ID",
    ).toBeGreaterThan(0);
  }

  expect(
    bookingIds.every(
      (booking) =>
        Object.keys(booking).length === 1 &&
        typeof booking.bookingid === "number",
    ),
    "Every booking search result should only contain a numeric bookingid",
  ).toBe(true);
}
