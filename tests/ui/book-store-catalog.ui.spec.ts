import { test } from "./fixtures/pages.fixture.js";
import type { BookStoreTestData } from "../../src/ui/types/book-store.types.js";
import { loadJsonFile } from "../../src/ui/utils/json-loader.js";

const testData = loadJsonFile<BookStoreTestData>(
  "tests/ui/data/book-store-data.json",
);

test.describe("Book Store Catalog UI", () => {
  test("shows expected table headers and default catalog rows", async ({
    bookStorePage,
  }) => {
    const gitPocketGuide = testData.books.gitPocketGuide;
    const javascriptDesignPatterns = testData.books.javascriptDesignPatterns;

    await bookStorePage.goto();

    await bookStorePage.expectCatalogTableHeadersVisible();
    await bookStorePage.expectDefaultCatalogRowsVisible();
    await bookStorePage.expectDefaultBookVisible(gitPocketGuide.title);
    await bookStorePage.expectDefaultBookVisible(
      javascriptDesignPatterns.title,
    );
  });
});
