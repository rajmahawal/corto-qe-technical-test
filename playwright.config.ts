import { defineConfig, devices } from "@playwright/test";
import { API_BASE_URL, UI_BASE_URL } from "./src/config/env.js";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,

  expect: {
    timeout: 5_000,
  },

  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,

  reporter: [["list"], ["html", { open: "never" }]],

  use: {
    trace: "retain-on-failure",
  },

  projects: [
    {
      name: "api",
      testMatch: /api\/.*\.api\.spec\.ts/,
      use: {
        baseURL: API_BASE_URL,
        extraHTTPHeaders: {
          Accept: "application/json",
        },
      },
    },
    {
      name: "ui-chromium",
      testMatch: /ui\/.*\.ui\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: UI_BASE_URL,
        screenshot: "only-on-failure",
        video: "retain-on-failure",
      },
    },
  ],
});
