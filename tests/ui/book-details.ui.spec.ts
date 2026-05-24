import { test } from "@playwright/test";
import { BookDetailsPage } from "../../src/ui/pages/book-details.page.js";
import { BookStorePage } from "../../src/ui/pages/book-store.page.js";
import type { BookStoreTestData } from "../../src/ui/types/book-store.types.js";
import { loadJsonFile } from "../../src/ui/utils/json-loader.js";

const testData = loadJsonFile<BookStoreTestData>(
  "tests/ui/data/book-store-data.json",
);

test.describe("Book Details UI", () => {
  test("user can search for a book, view its details and return to the Book Store", async ({
    page,
  }) => {
    const bookStorePage = new BookStorePage(page);
    const bookDetailsPage = new BookDetailsPage(page);
    const book = testData.books.gitPocketGuide;

    await bookStorePage.goto();
    await bookStorePage.search(book.title);
    await bookStorePage.expectSearchValue(book.title);
    await bookStorePage.expectBookVisible(book.title);
    await bookStorePage.expectBookRowDetails(book);

    await bookStorePage.openBook(book.title);

    await bookDetailsPage.expectLoaded();
    await bookDetailsPage.expectBookDetails(book);
    await bookDetailsPage.expectAdditionalBookDetailsPopulated();

    await bookDetailsPage.backToBookStore();

    await bookStorePage.expectSearchValue("");
    await bookStorePage.expectBookVisible(book.title);
  });
});
