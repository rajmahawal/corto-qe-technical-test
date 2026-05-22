import { defineConfig, devices } from "@playwright/test";

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
      testMatch: /.*\.api\.spec\.ts/,
      use: {
        baseURL:
          process.env.API_BASE_URL ?? "https://restful-booker.herokuapp.com",
      },
    },
    {
      name: "ui-chromium",
      testMatch: /.*\.ui\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: process.env.UI_BASE_URL ?? "https://demoqa.com",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
      },
    },
  ],
});
