import { expect, type Locator, type Page } from "@playwright/test";
import type { BookTestData } from "../types/book-store.types.js";

export class BookDetailsPage {
  private readonly backToBookStoreButton: Locator;
  private readonly titleValue: Locator;
  private readonly authorValue: Locator;
  private readonly publisherValue: Locator;
  private readonly isbnValue: Locator;
  private readonly websiteValue: Locator;

  constructor(private readonly page: Page) {
    this.backToBookStoreButton = this.page.getByRole("button", {
      name: "Back To Book Store",
    });

    // DemoQA reuses #userName-value for multiple detail fields
    // wrapper ID discriminates them
    this.titleValue = this.page.locator("#title-wrapper #userName-value");
    this.authorValue = this.page.locator("#author-wrapper #userName-value");
    this.publisherValue = this.page.locator(
      "#publisher-wrapper #userName-value",
    );
    this.isbnValue = this.page.locator("#ISBN-wrapper #userName-value");
    this.websiteValue = this.page.locator("#website-wrapper #userName-value");
  }

  async expectLoaded(): Promise<void> {
    await expect(
      this.page,
      "Book details page should load successfully",
    ).toHaveURL(/\/books\?search=/);

    await expect(
      this.backToBookStoreButton,
      "Book details page should show back to book store button",
    ).toBeVisible();
  }

  async expectBookDetails(book: BookTestData): Promise<void> {
    await expect(
      this.titleValue,
      `Book details page should show title "${book.title}"`,
    ).toHaveText(book.title);

    await expect(
      this.authorValue,
      `Book details page should show author "${book.author}"`,
    ).toHaveText(book.author);

    await expect(
      this.publisherValue,
      `Book details page should show publisher "${book.publisher}"`,
    ).toHaveText(book.publisher);
  }

  async expectAdditionalBookDetailsPopulated(): Promise<void> {
    await expect(
      this.isbnValue,
      "Book details page should show a populated ISBN value",
    ).not.toBeEmpty();

    await expect(
      this.websiteValue,
      "Book details page should show a poplated website value",
    ).not.toBeEmpty();
  }

  async backToBookStore(): Promise<void> {
    await Promise.all([
      this.page.waitForURL(/\/books$/),
      this.backToBookStoreButton.click(),
    ]);
  }
}
