import { expect, type Locator, type Page } from "@playwright/test";
import type { BookTestData } from "../types/book-store.types.js";

export class BookStorePage {
  private readonly searchInput: Locator;
  private readonly bookRows: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = this.page.getByRole("textbox", {
      name: "Type to search",
    });
    this.bookRows = this.page.locator("tbody tr");
  }

  async goto(): Promise<void> {
    await this.page.goto("/books");

    await expect(
      this.page,
      "Book Store page should load successfully",
    ).toHaveURL(/\/books$/);

    await expect(
      this.searchInput,
      "Book Store search input should be visible",
    ).toBeVisible();
  }

  async search(searchTerm: string): Promise<void> {
    await this.searchInput.fill(searchTerm);
  }

  async expectSearchValue(expectedValue: string): Promise<void> {
    await expect(
      this.searchInput,
      `Search input should contain "${expectedValue}"`,
    ).toHaveValue(expectedValue);
  }

  private bookTitleLink(title: string): Locator {
    return this.page.getByRole("link", { name: title, exact: true });
  }

  private bookRowByTitle(title: string): Locator {
    return this.page.getByRole("row").filter({
      has: this.bookTitleLink(title),
    });
  }

  async expectCatalogTableHeadersVisible(): Promise<void> {
    const expectedHeaders = ["Image", "Title", "Author", "Publisher"];

    for (const header of expectedHeaders) {
      await expect(
        this.page.getByRole("columnheader", { name: header }),
        `Book Store table should show "${header}" column header`,
      ).toBeVisible();
    }
  }

  async expectDefaultCatalogRowsVisible(): Promise<void> {
    await expect(
      this.bookRows,
      "Book Store should show default catalog rows",
    ).not.toHaveCount(0);
  }

  async openBook(title: string): Promise<void> {
    await Promise.all([
      this.page.waitForURL((url) => url.toString().includes("/books?search="), {
        timeout: 10_000,
      }),
      this.bookTitleLink(title).click(),
    ]);
  }

  private async expectTitleLinkVisible(
    title: string,
    message: string,
  ): Promise<void> {
    await expect(this.bookTitleLink(title), message).toBeVisible();
  }

  async expectBookVisible(title: string): Promise<void> {
    await this.expectTitleLinkVisible(
      title,
      `Book titled "${title}" should be visible in search results`,
    );
  }

  async expectDefaultBookVisible(title: string): Promise<void> {
    await this.expectTitleLinkVisible(
      title,
      `Default catalog should include "${title}"`,
    );
  }

  async expectBookNotVisible(title: string): Promise<void> {
    await expect(
      this.bookTitleLink(title),
      `Book titled "${title}" should not be visible in the current results`,
    ).toBeHidden();
  }

  async expectBookRowDetails(book: BookTestData): Promise<void> {
    const bookRow = this.bookRowByTitle(book.title);

    await expect(
      bookRow,
      `Book row for "${book.title}" should be visible`,
    ).toBeVisible();

    await expect(
      bookRow,
      `Book row for "${book.title}" should show author "${book.author}"`,
    ).toContainText(book.author);

    await expect(
      bookRow,
      `Book row for "${book.title}" should show publisher "${book.publisher}"`,
    ).toContainText(book.publisher);
  }

  async expectNoBookRows(): Promise<void> {
    await expect(
      this.bookRows,
      "No book rows should be displayed for a search with no matching results",
    ).toHaveCount(0);
  }
}
