export interface BookingDates {
  checkin: string;
  checkout: string;
}

export interface BookingPayload {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: BookingDates;
  additionalneeds: string;
}

export interface PartialBookingPayload {
  firstname?: string;
  lastname?: string;
  totalprice?: number;
  depositpaid?: boolean;
  bookingdates?: Partial<BookingDates>;
  additionalneeds?: string;
}

export interface CreateBookingResponse {
  bookingid: number;
  booking: BookingPayload;
}

export interface BookingIdResponse {
  bookingid: number;
}

export interface AuthTokenResponse {
  token?: string;
  reason?: string;
}

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface BookingSearchFilters {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

export interface BookingTestData {
  auth: {
    valid: AuthCredentials;
    invalid: AuthCredentials;
  };
  bookings: {
    create: BookingPayload;
    update: BookingPayload;
    partialUpdate: PartialBookingPayload;
  };
  invalidBookingId: number;
}
