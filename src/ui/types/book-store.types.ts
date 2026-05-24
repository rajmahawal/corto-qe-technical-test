export interface BookTestData {
  title: string;
  partialSearch: string;
  author: string;
  publisher: string;
}

export interface BookStoreTestData {
  books: {
    gitPocketGuide: BookTestData;
    javascriptDesignPatterns: BookTestData;
  };
  search: {
    noResults: string;
  };
}
