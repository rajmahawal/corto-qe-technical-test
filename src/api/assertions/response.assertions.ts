import { expect, type APIResponse } from "@playwright/test";

export async function expectStatus(
  response: APIResponse,
  expectedStatus: number,
  message: string,
): Promise<void> {
  const actualStatus = response.status();

  if (actualStatus !== expectedStatus) {
    const responseBody = await response.text();

    // NOTE: Providing the response body on failure saves a lot of time debugging
    // CI logs do not always make it obvious what the API actually returned
    throw new Error(
      [
        message,
        `Expected status: ${expectedStatus}`,
        `Actual status: ${actualStatus}`,
        `Request URL: ${response.url()}`,
        `Response body: ${responseBody}`,
      ].join("\n"),
    );
  }

  expect(actualStatus, message).toBe(expectedStatus);
}

export async function expectStatusIn(
  response: APIResponse,
  expectedStatuses: number[],
  message: string,
): Promise<void> {
  const actualStatus = response.status();

  if (!expectedStatuses.includes(actualStatus)) {
    const responseBody = await response.text();

    throw new Error(
      [
        message,
        `Expected statuses: ${expectedStatuses.join(", ")}`,
        `Actual status: ${actualStatus}`,
        `Request URL: ${response.url()}`,
        `Response body: ${responseBody}`,
      ].join("\n"),
    );
  }

  expect(expectedStatuses, message).toContain(actualStatus);
}

export async function expectJsonResponse<T>(
  response: APIResponse,
  message: string,
): Promise<T> {
  const responseBody = (await response.json()) as T;

  expect(responseBody, message).not.toBeNull();
  expect(responseBody, message).not.toBeUndefined();

  return responseBody;
}

export async function expectTextResponse(
  response: APIResponse,
  expectedText: string,
  message: string,
): Promise<void> {
  const responseBody = await response.text();

  expect(responseBody.trim(), message).toBe(expectedText);
}
