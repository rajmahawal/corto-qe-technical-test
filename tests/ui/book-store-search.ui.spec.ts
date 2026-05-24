import { test } from "./fixtures/pages.fixture.js";
import type { BookStoreTestData } from "../../src/ui/types/book-store.types.js";
import { loadJsonFile } from "../../src/ui/utils/json-loader.js";

const testData = loadJsonFile<BookStoreTestData>(
  "tests/ui/data/book-store-data.json",
);

test.describe("Book Store Search UI", () => {
  test("user can search for a book by exact title", async ({
    bookStorePage,
  }) => {
    const book = testData.books.gitPocketGuide;

    await bookStorePage.goto();
    await bookStorePage.search(book.title);

    await bookStorePage.expectSearchValue(book.title);
    await bookStorePage.expectBookVisible(book.title);
    await bookStorePage.expectBookRowDetails(book);
  });

  test("user can search for books by partial title", async ({
    bookStorePage,
  }) => {
    const matchingBook = testData.books.javascriptDesignPatterns;
    const nonMatchingBook = testData.books.gitPocketGuide;

    await bookStorePage.goto();
    await bookStorePage.search(matchingBook.partialSearch);

    await bookStorePage.expectSearchValue(matchingBook.partialSearch);
    await bookStorePage.expectBookVisible(matchingBook.title);
    await bookStorePage.expectBookRowDetails(matchingBook);
    await bookStorePage.expectBookNotVisible(nonMatchingBook.title);
  });

  test("user sees no book rows for a non-matching search", async ({
    bookStorePage,
  }) => {
    await bookStorePage.goto();
    await bookStorePage.search(testData.search.noResults);

    await bookStorePage.expectSearchValue(testData.search.noResults);
    await bookStorePage.expectNoBookRows();
  });
});
