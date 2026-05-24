import { test as base } from "@playwright/test";
import { BookDetailsPage } from "../../../src/ui/pages/book-details.page.js";
import { BookStorePage } from "../../../src/ui/pages/book-store.page.js";

type Pages = {
  bookStorePage: BookStorePage;
  bookDetailsPage: BookDetailsPage;
};

export const test = base.extend<Pages>({
  bookStorePage: async ({ page }, use) => {
    await use(new BookStorePage(page));
  },
  bookDetailsPage: async ({ page }, use) => {
    await use(new BookDetailsPage(page));
  },
});
