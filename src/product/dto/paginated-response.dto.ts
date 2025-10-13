export class PaginatedResponse<T> {
  totalItems: number;
  items: T[];
  page: number;
  size: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  constructor(items: T[], total: number, page: number, size: number) {
    this.items = items;
    this.totalItems = total;
    this.page = page;
    this.size = size;
    this.totalPages = Math.ceil(total / size);
    this.hasNextPage = page < this.totalPages - 1;
    this.hasPreviousPage = page > 0;
  }
}