import type { APIRequestContext, APIResponse } from "@playwright/test";
import type {
  AuthCredentials,
  BookingPayload,
  BookingSearchFilters,
  PartialBookingPayload,
} from "../types/booking.types.js";

export class RestfulBookerClient {
  constructor(private readonly request: APIRequestContext) {}

  async healthCheck(): Promise<APIResponse> {
    return this.request.get("/ping");
  }

  async createToken(credentials: AuthCredentials): Promise<APIResponse> {
    return this.request.post("/auth", {
      data: credentials,
    });
  }

  async getBookingIds(filters?: BookingSearchFilters): Promise<APIResponse> {
    const params: Record<string, string> = {};

    if (filters?.firstname) {
      params.firstname = filters.firstname;
    }

    if (filters?.lastname) {
      params.lastname = filters.lastname;
    }

    if (filters?.checkin) {
      params.checkin = filters.checkin;
    }

    if (filters?.checkout) {
      params.checkout = filters.checkout;
    }

    return this.request.get("/booking", {
      params,
    });
  }

  async getBooking(bookingId: number): Promise<APIResponse> {
    return this.request.get(`/booking/${bookingId}`);
  }

  async createBooking(booking: BookingPayload): Promise<APIResponse> {
    return this.request.post("/booking", {
      data: booking,
    });
  }

  // NOTE: Basic auth header is also supported by the API but cookie token works more reliably across environments in practice
  async updateBooking(
    bookingId: number,
    booking: BookingPayload,
    token: string,
  ): Promise<APIResponse> {
    return this.request.put(`/booking/${bookingId}`, {
      data: booking,
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }

  async partialUpdateBooking(
    bookingId: number,
    booking: PartialBookingPayload,
    token: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${bookingId}`, {
      data: booking,
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }

  // TODO:  can add retry logic here for flaky network conditions in CI
  async deleteBooking(bookingId: number, token: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
  }

  async updateBookingWithoutAuth(
    bookingId: number,
    booking: BookingPayload,
  ): Promise<APIResponse> {
    return this.request.put(`/booking/${bookingId}`, {
      data: booking,
    });
  }

  async deleteBookingWithoutAuth(bookingId: number): Promise<APIResponse> {
    return this.request.delete(`/booking/${bookingId}`);
  }

  // NOTE: no cookie/auth header intentionally as testing unauthenticated PATCH behaviour
  async partialUpdateBookingWithoutAuth(
    bookingId: number,
    booking: PartialBookingPayload,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${bookingId}`, {
      data: booking,
    });
  }

  async createBookingWithRawPayload(
    payload: string,
    contentType: string,
  ): Promise<APIResponse> {
    return this.request.post("/booking", {
      data: payload,
      headers: {
        "Content-Type": contentType,
        Accept: "application/json",
      },
    });
  }

  async updateBookingWithRawPayload(
    bookingId: number,
    payload: string,
    contentType: string,
    token: string,
  ): Promise<APIResponse> {
    return this.request.put(`/booking/${bookingId}`, {
      data: payload,
      headers: {
        Cookie: `token=${token}`,
        "Content-Type": contentType,
        Accept: "application/json",
      },
    });
  }

  async partialUpdateBookingWithRawPayload(
    bookingId: number,
    payload: string,
    contentType: string,
    token: string,
  ): Promise<APIResponse> {
    return this.request.patch(`/booking/${bookingId}`, {
      data: payload,
      headers: {
        Cookie: `token=${token}`,
        "Content-Type": contentType,
        Accept: "application/json",
      },
    });
  }
}
