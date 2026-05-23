import { test } from "@playwright/test";
import { RestfulBookerClient } from "../../src/api/clients/restful-booker.client.js";
import { expectStatusIn } from "../../src/api/assertions/response.assertions.js";

test.describe("HealthCheck API", () => {
  test("returns a healthy API status", async ({ request }) => {
    const restfulBookerClient = new RestfulBookerClient(request);

    const response = await restfulBookerClient.healthCheck();

    await expectStatusIn(
      response,
      [200, 201],
      "HealthCheck should return a successful status when the API is available",
    );
  });
});
