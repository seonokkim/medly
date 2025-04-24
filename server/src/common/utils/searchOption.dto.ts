export interface SearchOption {
  page: number;
  limit: number;
  sort?: string[];
}

export class SearchOptionDto {
  private readonly so: SearchOption;

  constructor() {
    this.so = {
      page: 1,
      limit: 1,
      sort: ['new'],
    };
  }

  page(page: number): SearchOptionDto {
    this.so.page = page;
    return this;
  }

  limit(limit: number): SearchOptionDto {
    this.so.limit = limit;
    return this;
  }

  sort(sort: string[]): SearchOptionDto {
    this.so.sort = sort;
    return this;
  }

  build(): SearchOption {
    return this.so;
  }
}
