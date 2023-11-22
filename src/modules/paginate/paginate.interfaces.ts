export interface QueryResult {
  results: Document[];
  page: number;
  prev: number | null;
  next: number | null;
  limit: number;
  totalPages: number;
  totalResults: number;
}
