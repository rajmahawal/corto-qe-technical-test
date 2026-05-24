import type { BookingPayload } from "../types/booking.types.js";

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
