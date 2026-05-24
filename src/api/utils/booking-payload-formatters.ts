import type {
  BookingPayload,
  PartialBookingPayload,
} from "../types/booking.types.js";

function escapeXmlValue(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function formatBookingAsXml(booking: BookingPayload): string {
  return `
<booking>
  <firstname>${escapeXmlValue(booking.firstname)}</firstname>
  <lastname>${escapeXmlValue(booking.lastname)}</lastname>
  <totalprice>${booking.totalprice}</totalprice>
  <depositpaid>${booking.depositpaid}</depositpaid>
  <bookingdates>
    <checkin>${booking.bookingdates.checkin}</checkin>
    <checkout>${booking.bookingdates.checkout}</checkout>
  </bookingdates>
  <additionalneeds>${escapeXmlValue(booking.additionalneeds)}</additionalneeds>
</booking>
`.trim();
}

export function formatPartialBookingAsXml(
  booking: PartialBookingPayload,
): string {
  const fields: string[] = [];

  if (booking.firstname !== undefined) {
    fields.push(
      `  <firstname>${escapeXmlValue(booking.firstname)}</firstname>`,
    );
  }

  if (booking.lastname !== undefined) {
    fields.push(`  <lastname>${escapeXmlValue(booking.lastname)}</lastname>`);
  }

  if (booking.totalprice !== undefined) {
    fields.push(`  <totalprice>${booking.totalprice}</totalprice>`);
  }

  if (booking.depositpaid !== undefined) {
    fields.push(`  <depositpaid>${booking.depositpaid}</depositpaid>`);
  }

  if (booking.bookingdates !== undefined) {
    const bookingDateFields: string[] = [];

    if (booking.bookingdates.checkin !== undefined) {
      bookingDateFields.push(
        `    <checkin>${booking.bookingdates.checkin}</checkin>`,
      );
    }

    if (booking.bookingdates.checkout !== undefined) {
      bookingDateFields.push(
        `    <checkout>${booking.bookingdates.checkout}</checkout>`,
      );
    }

    fields.push(
      `  <bookingdates>\n${bookingDateFields.join("\n")}\n  </bookingdates>`,
    );
  }

  if (booking.additionalneeds !== undefined) {
    fields.push(
      `  <additionalneeds>${escapeXmlValue(booking.additionalneeds)}</additionalneeds>`,
    );
  }

  return `<booking>\n${fields.join("\n")}\n</booking>`;
}

export function formatBookingAsUrlEncoded(booking: BookingPayload): string {
  const formData = new URLSearchParams();

  formData.set("firstname", booking.firstname);
  formData.set("lastname", booking.lastname);
  formData.set("totalprice", String(booking.totalprice));
  formData.set("depositpaid", String(booking.depositpaid));
  formData.set("bookingdates[checkin]", booking.bookingdates.checkin);
  formData.set("bookingdates[checkout]", booking.bookingdates.checkout);
  formData.set("additionalneeds", booking.additionalneeds);

  return formData.toString();
}

export function formatPartialBookingAsUrlEncoded(
  booking: PartialBookingPayload,
): string {
  const formData = new URLSearchParams();

  if (booking.firstname !== undefined) {
    formData.set("firstname", booking.firstname);
  }

  if (booking.lastname !== undefined) {
    formData.set("lastname", booking.lastname);
  }

  if (booking.totalprice !== undefined) {
    formData.set("totalprice", String(booking.totalprice));
  }

  if (booking.depositpaid !== undefined) {
    formData.set("depositpaid", String(booking.depositpaid));
  }

  if (booking.bookingdates?.checkin !== undefined) {
    formData.set("bookingdates[checkin]", booking.bookingdates.checkin);
  }

  if (booking.bookingdates?.checkout !== undefined) {
    formData.set("bookingdates[checkout]", booking.bookingdates.checkout);
  }

  if (booking.additionalneeds !== undefined) {
    formData.set("additionalneeds", booking.additionalneeds);
  }

  return formData.toString();
}
